import Immutable from 'immutable';
import { fromJS } from 'immutable';

const init = {
	"from": "orders@dataskeptic.com",
	"to": "kylepolich@gmail.com",
	"subject": "Hello from Data Skeptic",
	"body": "I can't feel my body",
	"templates": [
		{
			"name": "Order confirmation", 
			"subject": "dataskeptic.com - order confirmed",
			"body": "Hi {name},\n\nWe wanted to let you know that your order has processed and we'll send another confirmation shortly when it ships.\n\nThanks for your support,\n\nThe Data Skeptic team"
		},
		{
			"name": "Order shipped", 
			"subject": "dataskeptic.com - order shipped",
			"body": "Hi {name],\n\nWe wanted to let you know that your recent order has shipped.\n\nThanks for your support,\n\nThe Data Skeptic team"
		}
	]
}

const defaultState = Immutable.fromJS(init);

export default function adminReducer(state = defaultState, action) {
  var nstate = state.toJS()
  switch(action.type) {
    case 'SET_EMAIL_FROM':
    	nstate.from = action.payload
    	break
    case 'SET_EMAIL_TO':
    	nstate.to = action.payload
    	break
    case 'SET_EMAIL_SUBJECT':
    	nstate.subject = action.payload
    	break
    case 'SET_EMAIL_BODY':
    	nstate.body = action.payload
    	break
    case 'PICK_EMAIL_TEMPLATE':
    	var template = action.payload
    	var i = 0
    	while (i < nstate.templates.length) {
    		var t = nstate.templates[i]
    		if (t['name'] == template) {
    			nstate.subject = t['subject']
    			nstate.body = t['body']
    		}
    		i += 1
    	}
    case 'SEND_EMAIL':
    	var header = "https://s3.amazonaws.com/dataskeptic.com/img/png/email-header.png"
    	var header = "https://s3.amazonaws.com/dataskeptic.com/img/png/email-footer.png"
    	break;
  }
  return Immutable.fromJS(nstate)
}
