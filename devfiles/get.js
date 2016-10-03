function get(p) {
	try {
		var req = new XMLHttpRequest()
		req.open('GET', p.url, true)
		req.responseType = 'text'
		req.onreadystatechange = function () {
			if (req.readyState == XMLHttpRequest.DONE) {
				switch (req.status) {
					case 200:
						if (typeof p.done === 'function') p.done(JSON.parse(req.responseText))
						break
					default:
						if (typeof p.fail === 'function') p.fail(req.status)
						else throw new Error('error ' + req.status + ' from server')
				}
			}
		}
		req.send() // send the request
	} catch (err) {
		console.log(err)
	}
}