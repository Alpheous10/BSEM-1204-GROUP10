from fastapi import APIRouter, Depends
from auth import get_current_user

router = APIRouter(
    prefix="/posts",
    tags=["Posts"]
)


@router.post("/")
def create_post(
    current_user = Depends(get_current_user)
):
    return {
        "message": f"Post created by {current_user.username}"
    }