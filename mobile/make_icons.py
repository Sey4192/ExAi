from PIL import Image
 
ART = Image.open("artwork.png").convert("RGBA")  # your logo: square, transparent background
# Trim empty transparent edges, then centre the logo on a square canvas.
ART = ART.crop(ART.getbbox())
side = max(ART.size)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(ART, ((side - ART.width) // 2, (side - ART.height) // 2))
ART = square

BLUE = (62, 107, 137, 255)  # #3E6B89, the app's main colour
 
 
def fit(img, size, scale):
    """Scale the artwork to `scale` of the canvas and centre it on a transparent square."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    art = img.resize((int(size * scale),) * 2, Image.Resampling.LANCZOS)
    canvas.paste(art, ((size - art.width) // 2,) * 2, art)
    return canvas
 
 
def solid(size):
    return Image.new("RGBA", (size, size), BLUE)
 
 
def silhouette(img, colour):
    """Same shape in one colour (keeps only the transparency)."""
    out = Image.new("RGBA", img.size, colour)
    out.putalpha(img.getchannel("A"))
    return out
 
 
# Main icon: 1024, no transparency.
icon = solid(1024)
icon.alpha_composite(fit(ART, 1024, 0.6))
icon.convert("RGB").save("assets/icon.png")
 
# Android adaptive icon: plain background, logo inside the safe zone, one-colour version.
solid(512).save("assets/android-icon-background.png")
fit(ART, 512, 0.5).save("assets/android-icon-foreground.png")
silhouette(fit(ART, 432, 0.5), (0, 0, 0, 255)).save("assets/android-icon-monochrome.png")
 
# Browser tab icon.
fav = solid(48)
fav.alpha_composite(fit(ART, 48, 0.7))
fav.save("assets/favicon.png")
 
# Notification icon: white on transparent only.
silhouette(fit(ART, 96, 0.8), (255, 255, 255, 255)).save("assets/notification-icon.png")
 
# Splash image.
fit(ART, 1024, 0.5).save("assets/splash-icon.png")
print("made 7 images")
