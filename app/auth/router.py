from fastapi import APIRouter

from schemas import UserSignupRequest


router = APIRouter(prefix="/auth")

@router.post('/signup', summary="Create new user")
async def create_user(data: UserSignupRequest):
    pass
    # # querying database to check if user already exist
    # user = db.get(data.email, None)
    # if user is not None:
    #         raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="User with this email already exist"
    #     )
    # user = {
    #     'email': data.email,
    #     'password': get_hashed_password(data.password),
    #     'id': str(uuid4())
    # }
    # db[data.email] = user    # saving user to database
    # return user
