from PIL import Image,ImageFilter

#INTERFACE
mode = input("noir-blanc ou negatif ?\n")




img = Image.open("arbe.jpg")
w, h = img.size
TRESH = 30

def moy(pixel):
    r,v,b=pixel
    return int((r//5+v*5+b)/6.2)

if mode == "noir-blanc":
    img2 = img.filter(ImageFilter.FIND_EDGES)
    img2 = img2.filter(ImageFilter.GaussianBlur(1))
    for x in range(w):
        for y in range(h):
            m2 = int(moy(img2.getpixel((x,y)))/4)
            if m2 < TRESH:
                m1 = moy(img.getpixel((x,y)))
                img.putpixel((x,y),(m1,m1,m1))
            else :
                img.putpixel((x,y),(m2,m2,m2))
else :
    for x in range(w):
        for y in range(h):
            r,v,b = img.getpixel((x,y))
            img.putpixel((x,y),(255-r,255-v,255-b))
            
img.save("rend.jpg")
img.show()