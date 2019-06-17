var express =require('express'),
    mongoose=require('mongoose'),
    bodyParser=require('body-parser')
    app= express();


app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }))

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
    })
})

app.listen(3000,()=>{
    console.log('hi guyz');
    
})