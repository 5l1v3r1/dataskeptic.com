const BinaryServer = require('binaryjs').BinaryServer;
const bs = BinaryServer({port: 9001});
const wav = require('wav');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const AWS = require("aws-sdk");

const sys = require('sys')
const exec = require('child_process').exec;

var env = "prod"

fs.open("config/config.json", "r", function (error, fd) {
    var buffer = new Buffer(10000)
    fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
        var data = buffer.toString("utf8", 0, bytesRead)
        var c = JSON.parse(data)
        var aws_accessKeyId = c[env]['aws']['accessKeyId']
        var aws_secretAccessKey = c[env]['aws']['secretAccessKey']
        var aws_region = c[env]['aws']['region']
        var recordingConfig = c[env]['recording']
        fs.close(fd)
        const LOCKED_FILE_NAME = recordingConfig.locked_file_name;
        const AWS_RECORDS_BUCKET = recordingConfig.aws_proposals_bucket;
        const BASE_RECORDS_PATH = path.join(__dirname, recordingConfig.source);
        AWS.config.update(
            {
                "accessKeyId": aws_accessKeyId,
                "secretAccessKey": aws_secretAccessKey,
                "region": aws_region
            }
        );
    })
})

const actions = require('./shared/Recorder/Constants/actions');

const generateRecordPath = (recordId) => path.join(BASE_RECORDS_PATH, recordId);
const generateChunkPath = (recordId, chunkId) => path.join(generateRecordPath(recordId), `${chunkId}.wav`);

const startRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);

    fse.ensureDirSync(recordingPath);
};

const isRecordingLocked = (recordId) => {
    const recordingPath = generateRecordPath(recordId);

};

const completeRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);
    lockRecording(recordId);
};

const lockRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);
    const lockFile = path.join(recordingPath, LOCKED_FILE_NAME);

    fse.outputFileSync(lockFile, 'complete')
};

const unlockRecording = (recordId) => {
    const recordingPath = generateRecordPath(recordId);
    const lockFile = path.join(recordingPath, LOCKED_FILE_NAME);

    fse.removeSync(lockFile);
};

const walkSync = (currentDirPath, callback) => {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
};

function fileList(dir) {
    return fs.readdirSync(dir).reduce((list, file) => {
        const name = path.join(dir, file);
        const isDir = fs.statSync(name).isDirectory();
        return list.concat(isDir ? fileList(name) : [name]);
    }, []);
}

const getRecordingChunks = (recordId) => {
    const recordingPath = generateRecordPath(recordId);

    return fileList(recordingPath);
};

const mergeFiles = (files, output) => {

};

const uploadToS3 = (filePath, id, clb) => {
    console.log('Uploading to s3', filePath);
    console.dir(AWS_RECORDS_BUCKET)

    fs.readFile(filePath, (err, data) => {
        if (err) throw err; // Something went wrong!
        const s3bucket = new AWS.S3({params: {Bucket: AWS_RECORDS_BUCKET}});
        s3bucket.createBucket(() => {
            const params = {
                Key: id+'.wav',
                Body: data
            };

            s3bucket.upload(params, clb);
        });
    });
};

const clearRecordingPath = (recordId) => {
    const recordingPath = generateRecordPath(recordId);


};

const convertFileToMp3 = (id, chunkId = 0) => {
    const filePath = generateChunkPath(id, chunkId);
    const recordPath = generateRecordPath(id)

    const mp3File = `${recordPath}/${chunkId}.mp3`;
    const command = `ffmpeg -i ${filePath} -f mp3 ${mp3File}`;

    return new Promise((res, rej) => {
        exec(command, function (error, stdout, stderr) {

            if (error) {
                return rej(error)
            }

            if (stderr) {
                return res(mp3File)
            }

            return res(mp3File)
        });
    })
}

const run = () => {
    console.log(`Wait for new user connections`);
    bs.on('connection', (client) => {
        console.dir('connection');

        let fileWriter = null;
        client.on('stream', (stream, meta) => {
            console.log('stream');
            console.log('meta', meta);

            const {id, chunkId, sampleRate} = meta;
            client.meta = {
                id,
                chunkId
            };
            startRecording(id);


            const filePath = generateChunkPath(id, chunkId);
            console.log('client sample rate:', sampleRate);
            console.log('writing in:', filePath);
            let fileWriter = new wav.FileWriter(filePath, {
                channels: 1,
                sampleRate: sampleRate,
                bitDepth: 16
            });

            stream.pipe(fileWriter);
        });

        client.on('close', () => {
            const {id, chunkId} = client.meta;

            completeRecording(id);

            convertFileToMp3(id)
                .then((filePath) => {
                    uploadToS3(filePath, id, (err, data) => {
                        if (err) {
                            console.log('error')
                            console.error(err);
                        } else {
                            console.log('success')
                            console.dir(data);

                            console.log('Success upload to S3', id);
                            clearRecordingPath(id);
                        }
                    });
                })

            if (fileWriter !== null) {
                fileWriter.end();
            }
        });
    });
};

require('babel-core/register')({});
require('babel-polyfill');
run();