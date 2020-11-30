require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('5fb2cb504c78a81ffaeb0ed6').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false})
// }).then((result) => {
//     console.log('Uncompleted Tasks:', result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const deleteTask = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5fb2f45a643cdf2838e84ac7').then((count) => {
    console.log('Count: ', count)
}).catch((e) => {
    console.log(e)
})