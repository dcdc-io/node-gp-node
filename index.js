require("node-gp")
const smartcard = require('smartcard')

const Devices = smartcard.Devices
const devices = new Devices()

devices.on('device-activated', event => {
    event.device.on('card-inserted', async event => {
        // delay because of system smartcard contention locking out access
        await new Promise(resolve => setTimeout(resolve, 3000))
        const transceive = event.card.issueCommand.bind(event.card)
        const gpcard = new GlobalPlatform(transceive)
        gpcard.connect().then(() => {
            console.log("connected")
            // now you have a connected device
            gpcard.getPackages().then(packages => {
                if (packages.length) {
                    for (let package of packages) {
                        // print out package aids
                        console.log("found package: " + Buffer.from(package.aid).toString("hex"))
                    }
                } else {
                    console.log("no packages on this device")
                }
            })
        }).catch(error => {
            console.error(error)
        })
    })
})