from app import db
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
from typing import Optional


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(60), nullable=False)
 
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username
        }
    
class Project(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    techs: Mapped[list[str]] = mapped_column(String(300), nullable=False) 
    repo_url: Mapped[str] = mapped_column(String(300), nullable=False)
    live_url: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)
    images: Mapped[list[str]] = mapped_column(String(1000), nullable=True)
    main_image_index: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def serialize(self):
        images_list = self.images.split(",") if self.images else []
        

        def make_full_url(url):
            if url and url.startswith('/static/uploads/'):
                return f'http://localhost:5100{url}'
            return url
        
  
        full_images_list = [make_full_url(img) for img in images_list]
        
    
        main_image = None
        if full_images_list and self.main_image_index is not None and 0 <= self.main_image_index < len(full_images_list):
            main_image = full_images_list[self.main_image_index]
        elif self.image_url:
            main_image = make_full_url(self.image_url)
        
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'techs': self.techs.split(",") if self.techs else [],
            'repo_url': self.repo_url,
            'live_url': self.live_url,
            'image_url': main_image,  
            'images': full_images_list,   
            'main_image_index': self.main_image_index,
            'created_at': self.created_at
        }
            