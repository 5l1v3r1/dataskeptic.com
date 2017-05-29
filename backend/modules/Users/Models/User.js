export default (data) => {
    return {
        firstName: data.firstName,
        fullName: data.fullName,
        type: data.type || "q",
        linkedinId: data.linkedinId,
        profilePic: data.profilePic || "q",
        membership: data.membership || "q",
        active: data.active || "q",
    }
}