
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.fields.simple import TextAreaField
from wtforms.validators import DataRequired

class UploadForm(FlaskForm):
    photo = FileField(label="Photo",validators=[FileRequired(), FileAllowed(['jpg', 'png'],"Only images are accepted")])
    description = TextAreaField(label="Description",validators=[DataRequired()])
