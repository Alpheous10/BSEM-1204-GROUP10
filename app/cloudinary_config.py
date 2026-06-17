import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


def upload_file(contents: bytes, folder: str, resource_type: str = "auto",
                public_id: str = None, transformation: list = None) -> str:
    kwargs = {
        "folder": folder,
        "resource_type": resource_type,
    }
    if public_id:
        kwargs["public_id"] = public_id
    if transformation:
        kwargs["transformation"] = transformation

    result = cloudinary.uploader.upload(contents, **kwargs)
    return result["secure_url"]


def delete_file(public_id: str, resource_type: str = "image") -> None:
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    except Exception:
        pass
