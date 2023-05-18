import matplotlib.pyplot as plt
import numpy as np
import sys
from tensorflow.keras.models import Model
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image



args = sys.argv[1:]

filename="src\\python\\model_gender.h5"

image_path= "uploads\\test.jpg"

# image_path.replace("/", "\\")

# print(image_path)

loaded_model=load_model(filename)

img=image.load_img(r'C:\Users\Nikhil\ml-backend\uploads\test.jpg',target_size=(220, 220, 3))

plt.imshow(img)
img=image.img_to_array(img)
img=img/255.0
img=np.expand_dims(img,axis=0)
img_class=loaded_model.predict(img)
img_class


# In[22]:


val=img_class[0]


# In[23]:


if(val>=0.5):
 print("Male")
else:
 print("Female")


# In[ ]:




