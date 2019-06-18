var express =require('express'),
    mongoose=require('mongoose'),
    bodyParser=require('body-parser'),
    methodOverride=require('method-override'),
    expressSanitizer= require('express-sanitizer'),
    app= express();


app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(expressSanitizer());
//mongoose connection
mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true });
// model and schema
var blogSchema= new mongoose.Schema({
     
    title: String,
    image: String,
    body: String,
    createdAt: {type: Date, default: Date.now}
});

var Blog= mongoose.model('Blog',blogSchema);
/*
Blog.create({
    title: "first",
    image: "caegkcas.jpg",
    body:"hi guyz"
})
*/
app.get('/',(req,res)=>{
    res.redirect('/blogs');
})

app.get('/blogs',(req,res)=>{
  
 // req.body.blog.body=req.sanitize(req.body.blog.body)
  Blog.find({},(err,blogs)=>{
      if(err)
      {
          console.log('error');
    } else{
        res.render('index',{blogs:blogs});
    }
  });
});

app.get('/blogs/new',(req,res)=>{
   res.render('new');
});

app.post('/blogs',(req,res)=>{

    Blog.create(req.body.blog,(err,newBlog)=>{
        if(err)
         {
             res.redirect('/blogs/new');
         }
         else{
             res.redirect('/blogs');
         }
    });
});

app.get('/blogs/:id',(req,res)=>{

    Blog.findById(req.params.id, (err,foundBlog)=>{
      if(err)
      {
          res.redirect('/blogs');
      }
      else
      {
          res.render('show',{blog: foundBlog});
      }
    });
});

app.get('/blogs/:id/edit',(req,res)=>{

    Blog.findById(req.params.id, (err,foundBlog)=>{
      if(err)
      {
          res.redirect('/blogs');
      }
      else
      {
          res.render('edit',{blog: foundBlog});
      }
    });
});

app.put('/blogs/:id',(req,res)=>{
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, (err,updatedBlog)=>{
        if(err)
          {
              res.redirect('/blogs');
          }
        else
        {
            res.redirect('/blogs/'+req.params.id);
        }
    });
});

app.delete('/blogs/:id',(req,res)=>{
   //res.send('hello baba');
   Blog.findByIdAndRemove(req.params.id,(err)=>{
      if(err)
      {
          res.redirect('/blogs');
      }
      else
      res.redirect('/blogs');
   })
});

app.listen(3000,()=>{
    console.log('hi guyz');
    
})