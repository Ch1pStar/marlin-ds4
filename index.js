const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const ds = require('./ds');
let port;


let X = -127;
let Y = 0;

const PRECISION = 6;

SerialPort.list().then((ports)=>{
	console.log(ports)

	port = new SerialPort('COM6', {baudRate: 250000}, function (err) {
	  if (err) {
	    return console.log('Error: ', err.message)
	  }
	})

	port.on('open', ()=>{
		const parser = port.pipe(new Readline({ delimiter: '\n' }))

		parser.on('data', (val)=>console.log(`Printer msg: ${val}`))

		setInterval(()=>{
			sendCommand(`G0 X${X/PRECISION}\n`);
			sendCommand(`G0 Y${Y/PRECISION}\n`);
		}, 100);

	});

	const conn = ds.open(ds.getDevices()[0]);

	conn.ondigital = (type, isDown) => {
		if(!isDown) return;

		if(type == 'cross') {
			X+=10;
		}else if(type =='circle') {
			X-=10;
		}
	}

	conn.onanalog = (trigger, val, val2) => {
		//  lStickX, lStickY
		//  rStickX, rStickY

		if(trigger == 'lStickX') {
			// console.log(`X: ${val}`);
			X = val;
		}

		if(trigger == 'lStickY') {
			// console.log(`Y: ${val}`);
			Y = val;
		}

		// if(trigger === 'rStickY	')
		// console.log(trigger, val); return;
		// if(trigger == 'l2') {
		// 	sendCommand(`G0 X${val/6}\n`);
		// }
		// if(trigger == 'r2') {
		// 	sendCommand(`G0 Y${val/6}\n`);
		// }

	}

	function sendCommand(command = `G0 X${X}\n`) {
		console.log('Sent:', command);

		port.write(command, function(err) {
		  if (err) {
		    return console.log('Error on write: ', err.message)
		  }
		  // console.log('message written', command)
		})
	}

});




// G0 X12 


