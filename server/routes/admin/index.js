module.exports = app =>{
    const express = require('express')
    const router = express.Router({
      mergeParams:true
    })

    //创建分类
    router.post('/',async(req,res)=>{
      const model = await req.Model.create(req.body)
      res.send(model)
    })
    //更改修改后的数据
  router.put('/:id',async(req,res)=>{
      const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
      res.send(model)
    })
    //删除数据
    router.delete('/:id',async(req,res)=>{
     await req.Model.findByIdAndDelete(req.params.id,req.body)
     res.send(
       {success:true}
     )
    })
    //获得分类列表的包括父级数据
    router.get('/',async(req,res)=>{
      let queryOptions = {}
      if (req.Model.modelName ==='Category'){
        queryOptions.populate = 'parent'
      }
      const items = await req.Model.find().setOptions(queryOptions).limit(10)
      res.send(items)
    })
    //更改分类时获取分类的具体内容
    router.get('/:id',async(req,res)=>{
      const model = await req.Model.findById(req.params.id)
      res.send(model)
    })
    app.use('/admin/api/rest/:resource',async(req,res,next)=>{
      const modelName = require('inflection').classify(req.params.resource)
      req.Model = require(`../../models/${modelName}`)
      next()
    },router)
    //上传图片
    const multer = require('multer')
    const upload = multer({dest:__dirname+'/../../uploads'})
    app.post('/admin/api/upload',upload.single('file'),async(req,res)=>{
      const file = req.file
      file.url = `http://localhost:3000/uploads/${file.filename}`
      res.send(file)
    })
}