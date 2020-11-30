require('../src/db/mongoose')
const User = require('../src/models/user')



// User.findByIdAndUpdate('5f97470c2700f814909f6b21', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age: age})
    const count = await User.countDocuments({age: age})
    return count
}

updateAgeAndCount('5f9747312700f814909f6b22', 5).then((count) => {
    console.log('count:', count)
}).catch((e) => {
    console.log(e)
})