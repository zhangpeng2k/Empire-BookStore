require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('koa2-cors');

// Importing required models and functions
const { User, Book, Order, DiscountCode } = require('./models');
const { isAuthenticated } = require('./middlewares');

const app = new Koa();
const router = new Router();

const username = process.env.DBusername;
const password = process.env.DBpassword;
const dbName = process.env.DBname;

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

const dbURI = `mongodb+srv://${username}:${password}@cluster0.adxcm2e.mongodb.net/${dbName}?retryWrites=true&w=majority`;




// Register
router.post('/register', async (ctx, next) => {

    const { email, password, first_name, last_name, phone_number } = ctx.request.body;

    if (!email || !password || !first_name || !last_name) {
        ctx.status = 400;
        ctx.body = { message: 'All fields  are required' };
        return;
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        ctx.status = 400;
        ctx.body = { message: 'Email already exists' };
        return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        email, passwordHash, first_name, last_name, phone_number
    });

    await user.save();

    ctx.status = 201;
    ctx.body = { message: 'User registered successfully' };
});

// Login
router.post('/login', async (ctx, next) => {
    const { email, password } = ctx.request.body;
    if (!email || !password) {
        ctx.status = 400;
        ctx.body = { message: 'All fields (email, password) are required' };
        return;
    }
    const user = await User.findOne({ email });

    if (!user) {
        ctx.status = 401;
        ctx.body = { message: 'Invalid email or password' };
        return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatch) {
        ctx.status = 401;
        ctx.body = { message: 'Invalid email or password' };
        return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    const userData = {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number||'',
    };

    ctx.status = 200;
    ctx.body = { message: 'Login successful', token, user: userData };
});

// Get user data
router.get('/user/:userId', isAuthenticated, async (ctx, next) => {
    const userId = ctx.params.userId;
    const user = await User.findById(userId, {
        passwordHash: 0,
    });

    if (!user) {
        ctx.status = 404;
        ctx.body = { message: 'User not found' };
        return;
    }

    const userData = {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
    };

    ctx.status = 200;
    ctx.body = { user: userData };
});


// Browse books
router.get('/books', async (ctx, next) => {
    const books = await Book.find({});
    ctx.status = 200;
    ctx.body = { books };
});
// Search books
router.get('/books/search/:query', async (ctx, next) => {
    const query = ctx.params.query;
    const regex = new RegExp(query, 'i');

    const books = await Book.find({
        $or: [
            { title: { $regex: regex } },
            { author: { $regex: regex } },
            { publisher: { $regex: regex } },
            { category: { $regex: regex } },
        ],
    });

    ctx.status = 200;
    ctx.body = { books };
});

// Search book by id
router.get('/books/:id', async (ctx, next) => {
    const id = ctx.params.id;
    const book = await Book.find({
        _id: id,
    });
    if (book) {
        ctx.status = 200;
        ctx.body = book[0] ;
    } else {
        ctx.status = 404;
        ctx.body = { message: 'Book not found' };
    }
});




// Sort books
router.get('/books/sort/:field', async (ctx, next) => {
    const field = ctx.params.field;
    const books = await Book.find({}).sort(field);
    ctx.status = 200;
    ctx.body = { books };
});

// Checkout and pay
router.post('/checkout', isAuthenticated, async (ctx, next) => {
    const { cart, discountCode } = ctx.request.body;

    // Calculate total cost
    let totalCost = 0;
    const items = [];
    for (const item of cart) {
        const book = await Book.findById(item._id);
        totalCost += book.price * item.quantity;
        items.push({
            book: {
                _id: book._id,
                title: book.title,
                author: book.author,
                price: book.price,
            },
            quantity: item.quantity,
        });
    }
    
    // Apply discount
    const discount = await DiscountCode.findOne({ code: discountCode });
    if (discount) {
        totalCost = totalCost * (1 - discount.discountPercentage / 100);
    }

    const order = new Order({
        user: ctx.state.user.id,
        items,
        totalCost,
        discountCode: discount ? discount._id : null,
    });

    await order.save();

    ctx.status = 200;
    ctx.body = { message: 'Order placed successfully', orderId: order._id };
});



// Order history
router.get('/orders', isAuthenticated, async (ctx, next) => {
    const orders = await Order.find({ user: ctx.state.user.id });
    ctx.status = 200;
    ctx.body = [...orders];
});

// Track order
router.get('/orders/:orderId', isAuthenticated, async (ctx, next) => {
    const order = await Order.findById(ctx.params.orderId);
    ctx.status = 200;
    ctx.body =  {order};
});

// Update order status
router.put('/orders/:id/status', isAuthenticated, async (ctx, next) => {
    const { status } = ctx.request.body;
  
    if (!['pending', 'cancelled', 'completed'].includes(status)) {
      ctx.status = 400;
      ctx.body = { message: 'Invalid status' };
      return;
    }
  
    const order = await Order.findById(ctx.params.id);
    if (!order) {
      ctx.status = 404;
      ctx.body = { message: 'Order not found' };
      return;
    }
  
    if (order.user.toString() !== ctx.state.user.id) {
      ctx.status = 403;
      ctx.body = { message: 'You do not have permission to update this order' };
      return;
    }
  
    order.status = status;
    await order.save();
  
    ctx.status = 200;
    ctx.body = { message: 'Order status updated successfully' };
  });
  

// Add a comment to a book
router.post('/books/:bookId/comments',isAuthenticated, async (ctx, next) => {
    const bookId = ctx.params.bookId;
    const { userId, text } = ctx.request.body;

    if (!userId || !text) {
        ctx.status = 400;
        ctx.body = { message: 'User ID and comment text are required' };
        return;
    }

    const book = await Book.findById(bookId);

    if (!book) {
        ctx.status = 404;
        ctx.body = { message: 'Book not found' };
        return;
    }

    const comment = {
        user: userId,
        text: text,
        createdAt: new Date(),
    };

    book.comments.push(comment);
    await book.save();

    ctx.status = 201;
    ctx.body = { message: 'Comment added successfully', comment };
});



app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
}));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((e) => {
        console.log('db, ', dbURI);
        console.log('Connected to MongoDB', e);
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully');

    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${ port }`);
    });
});