from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# FastAPI app
app = FastAPI(title="Portfolio API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: str

class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "practice"

class Topic(BaseModel):
    id: int
    name: str
    description: str

class Post(BaseModel):
    id: int
    title: str
    content: str
    topic_id: int
    author_id: int
    created_at: datetime

class PostCreate(BaseModel):
    title: str
    content: str
    topic_id: int

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    in_stock: bool

class Order(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime

class OrderCreate(BaseModel):
    items: List[dict]

# Mock data
fake_users_db = {
    "admin": {
        "username": "admin",
        "email": "admin@example.com",
        "full_name": "Admin User",
        "hashed_password": pwd_context.hash("admin123"),
        "role": "admin"
    },
    "practice": {
        "username": "practice",
        "email": "practice@example.com",
        "full_name": "Practice User",
        "hashed_password": pwd_context.hash("practice123"),
        "role": "practice"
    }
}

fake_topics_db = [
    {"id": 1, "name": "Manual Testing", "description": "Articles about manual testing techniques and best practices."},
    {"id": 2, "name": "Selenium", "description": "Tutorials and tips for Selenium automation."},
    {"id": 3, "name": "Python", "description": "Python programming for testers and developers."},
    {"id": 4, "name": "Travel", "description": "Travel experiences and recommendations."},
    {"id": 5, "name": "Career Growth", "description": "Tips for growing your career in tech."}
]

fake_posts_db = [
    {
        "id": 1,
        "title": "Getting Started with Selenium WebDriver",
        "content": "# Getting Started with Selenium WebDriver\n\nSelenium WebDriver is one of the most popular tools for automated testing of web applications...",
        "topic_id": 2,
        "author_id": 1,
        "created_at": datetime(2023, 2, 15)
    },
    {
        "id": 2,
        "title": "Best Practices for Manual Testing",
        "content": "# Best Practices for Manual Testing\n\nManual testing is a crucial part of the software development lifecycle...",
        "topic_id": 1,
        "author_id": 1,
        "created_at": datetime(2023, 1, 20)
    }
]

fake_products_db = [
    {
        "id": 1,
        "name": "Laptop",
        "description": "High-performance laptop with 16GB RAM and 512GB SSD",
        "price": 999.99,
        "category": "Electronics",
        "in_stock": True
    },
    {
        "id": 2,
        "name": "Smartphone",
        "description": "Latest smartphone with 128GB storage and 5G capability",
        "price": 699.99,
        "category": "Electronics",
        "in_stock": True
    }
]

fake_orders_db = []

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=payload.get("role"))
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user

async def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/topics", response_model=List[Topic])
async def get_topics():
    return fake_topics_db

@app.get("/posts", response_model=List[Post])
async def get_posts(topic_id: Optional[int] = None):
    if topic_id:
        return [post for post in fake_posts_db if post["topic_id"] == topic_id]
    return fake_posts_db

@app.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: int):
    for post in fake_posts_db:
        if post["id"] == post_id:
            return post
    raise HTTPException(status_code=404, detail="Post not found")

@app.post("/posts", response_model=Post)
async def create_post(post: PostCreate, current_user: User = Depends(get_admin_user)):
    new_post = {
        "id": len(fake_posts_db) + 1,
        "title": post.title,
        "content": post.content,
        "topic_id": post.topic_id,
        "author_id": 1,  # Assuming admin is author
        "created_at": datetime.now()
    }
    fake_posts_db.append(new_post)
    return new_post

@app.put("/posts/{post_id}", response_model=Post)
async def update_post(post_id: int, post: PostCreate, current_user: User = Depends(get_admin_user)):
    for i, p in enumerate(fake_posts_db):
        if p["id"] == post_id:
            fake_posts_db[i].update({
                "title": post.title,
                "content": post.content,
                "topic_id": post.topic_id
            })
            return fake_posts_db[i]
    raise HTTPException(status_code=404, detail="Post not found")

@app.delete("/posts/{post_id}")
async def delete_post(post_id: int, current_user: User = Depends(get_admin_user)):
    for i, post in enumerate(fake_posts_db):
        if post["id"] == post_id:
            del fake_posts_db[i]
            return {"message": "Post deleted"}
    raise HTTPException(status_code=404, detail="Post not found")

@app.get("/products", response_model=List[Product])
async def get_products():
    return fake_products_db

@app.post("/orders", response_model=Order)
async def create_order(order: OrderCreate, current_user: User = Depends(get_current_active_user)):
    # Calculate total amount based on items
    total_amount = 0
    for item in order.items:
        product_id = item.get("product_id")
        quantity = item.get("quantity", 1)
        
        # Find product
        product = next((p for p in fake_products_db if p["id"] == product_id), None)
        if product:
            total_amount += product["price"] * quantity
    
    new_order = {
        "id": len(fake_orders_db) + 1,
        "user_id": 1,  # Assuming user ID 1
        "total_amount": total_amount,
        "status": "pending",
        "created_at": datetime.now()
    }
    fake_orders_db.append(new_order)
    return new_order

@app.get("/admin/users", response_model=List[User])
async def get_users(current_user: User = Depends(get_admin_user)):
    return [User(**user) for user in fake_users_db.values()]

@app.post("/admin/users", response_model=User)
async def create_user(user: UserCreate, current_user: User = Depends(get_admin_user)):
    if user.username in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    fake_users_db[user.username] = user_dict
    return User(**user_dict)

@app.delete("/admin/users/{username}")
async def delete_user(username: str, current_user: User = Depends(get_admin_user)):
    if username not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    if username == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete admin user"
        )
    del fake_users_db[username]
    return {"message": "User deleted"}

# Lab API endpoints
@app.get("/lab/api/users")
async def lab_get_users(current_user: User = Depends(get_current_active_user)):
    return [
        {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin"},
        {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user"}
    ]

@app.get("/lab/api/users/{user_id}")
async def lab_get_user(user_id: int, current_user: User = Depends(get_current_active_user)):
    users = {
        1: {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "admin", "createdAt": "2023-01-15T08:30:00Z", "lastLogin": "2023-03-20T14:25:30Z"},
        2: {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user", "createdAt": "2023-01-20T10:15:00Z", "lastLogin": "2023-03-18T09:45:20Z"}
    }
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    return users[user_id]

@app.get("/lab/api/products")
async def lab_get_products():
    return [
        {"id": 1, "name": "Laptop", "price": 999.99, "category": "Electronics", "inStock": True},
        {"id": 2, "name": "Smartphone", "price": 699.99, "category": "Electronics", "inStock": True}
    ]

@app.get("/lab/api/special/slow")
async def lab_slow_endpoint():
    import asyncio
    await asyncio.sleep(5)
    return {"message": "This response was delayed by 5 seconds", "timestamp": datetime.now().isoformat()}

@app.get("/lab/api/special/error")
async def lab_error_endpoint():
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="This is a simulated server error"
    )

@app.get("/lab/api/special/secure")
async def lab_secure_endpoint(current_user: User = Depends(get_current_active_user), x_api_key: str = None):
    if x_api_key != "abc123":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    return {"message": "You have accessed a secure endpoint", "timestamp": datetime.now().isoformat()}

@app.post("/lab/db/query")
async def lab_db_query(query: dict, current_user: User = Depends(get_current_active_user)):
    # In a real app, this would execute the query against a database
    # For now, return mock data based on the schema and query
    schema = query.get("schema", "ecommerce")
    sql_query = query.get("query", "").lower()
    
    # Check if query is a SELECT statement (for safety)
    if not sql_query.startswith("select"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only SELECT queries are allowed"
        )
    
    # Return mock results based on schema
    if schema == "ecommerce":
        return {
            "columns": ["id", "name", "price", "category", "in_stock"],
            "rows": [
                [1, "Laptop", 999.99, "Electronics", True],
                [2, "Smartphone", 699.99, "Electronics", True],
                [3, "Headphones", 149.99, "Electronics", True],
                [4, "T-shirt", 19.99, "Clothing", True],
                [5, "Jeans", 49.99, "Clothing", False]
            ]
        }
    elif schema == "hr":
        return {
            "columns": ["id", "first_name", "last_name", "job_title", "department_id", "salary"],
            "rows": [
                [1, "Alice", "Johnson", "Software Engineer", 1, 85000.00],
                [2, "Bob", "Smith", "Product Manager", 2, 95000.00],
                [3, "Carol", "Williams", "UX Designer", 1, 80000.00],
                [4, "Dave", "Brown", "Marketing Specialist", 3, 75000.00],
                [5, "Eve", "Davis", "HR Manager", 4, 90000.00]
            ]
        }
    else:
        return {
            "columns": ["result"],
            "rows": [["No data found for this query"]]
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)