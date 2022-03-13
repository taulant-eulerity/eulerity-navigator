

const axios = require("axios")
let {writeFile} = require('fs')
const {promisify} = require('util')

writeFile = promisify(writeFile)

const fetchData = () => new Promise(async resolve => {
    const response = await axios('https://api.chucknorris.io/jokes/random')
    const joke = await response.data.value
    resolve(joke)
})


const apiCalls = (n, fetchData, finished, onRun) => {
    let counter = 0
    let results = []
    const recursiveCall = async () => {
        if(counter >= n) return finished(results)
        const joke = await fetchData()
        counter+=1
        results.push(joke)
        onRun(joke)
        recursiveCall()

    }
    recursiveCall()
    return results
}
const onRun = (unit) => {
    console.log(unit)
}
const finished = async (allJokes) => {
   await writeFile('./jokes.json', JSON.stringify(allJokes))
   console.log('all jokes uploaded')
}
const test = apiCalls(2, fetchData, finished, onRun)




