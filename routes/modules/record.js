const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const { numberFormat } = require('../../public/javascripts/function')


// -----Read----- //
router.get('/create', (req, res) => {
  res.render('new')
})

router.get('/category', (req, res) => {
  const filter = req.query.filter
  const userId = req.user._id
  if (filter.length === 0) { return res.redirect('/') }
  Record.find({ category: `${req.query.filter}`, userId })
    .lean()
    .then(record => {
      let totalAmount = 0
      const promise = []
      for (let i = 0; i < record.length; i++) {
        promise.push(record[i])
        totalAmount += Number(promise[i].amount)
      }
      let totalAmountFormat = numberFormat(totalAmount)

      res.render('index', { record, totalAmountFormat, filter })
    })
    .catch(error => console.log('error!'))
})

router.get('/months', (req, res) => {

  console.log(req.query)




  res.redirect('/')

})


router.get('/:id', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(record => { res.render('edit', { record }) })
    .catch(error => console.log('error!'))
})

// -----Create----- //
router.post('/create', (req, res) => {
  const body = req.body
  body.userId = req.user._id
  Record.find({ categoryName: { $regex: '' } })
    .lean()
    .then(record => {
      promise = []
      for (let i = 0; i < record.length; i++) {
        promise.push(record[i])
        if (body.category === '支出類別') { body.category = '其他' }
        if (body.merchant === '') { body.merchant = '其他' }
        if (body.category === promise[i].categoryName) { body.icon = promise[i].icon }
      }
      return Record.create(body)
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log('error!'))
})

// -----Update----- //
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  req.body.amount = Number(req.body.amount)
  Record.find({ categoryName: req.body.category })
    .then(record => { req.body.icon = record[0].icon })
  return Record.findOne({ _id, userId })
    .then(record => {
      record = Object.assign(record, req.body)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log('error!'))
})

// -----Delete----- //
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Record.findOne({ _id, userId })
    .then(record => {
      record.remove()
      res.redirect('/')
    })
    .catch(error => console.log('error!'))
})

module.exports = router