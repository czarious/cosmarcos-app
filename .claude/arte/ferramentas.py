import subprocess, os, io, sys
import numpy as np
from PIL import Image
CHROME=r'C:/Program Files/Google/Chrome/Application/chrome.exe'
def rasterizar(svg, png):
    tmp=os.path.join(os.environ.get('TEMP','.'),'cosmarcos-arte-perfil')
    subprocess.run([CHROME,'--headless=new','--disable-gpu','--hide-scrollbars',f'--user-data-dir={tmp}',
        f'--screenshot={png}','--window-size=960,2000','--default-background-color=00000000',
        'file:///'+svg.replace(os.sep,'/')],check=True,capture_output=True,timeout=120)
def webp(png, saida, limite=120*1024):
    im=Image.open(png).convert('RGB')
    assert im.size==(960,2000), im.size
    for q in range(90,20,-4):
        b=io.BytesIO(); im.save(b,'WEBP',quality=q,method=6)
        if b.tell()<=limite:
            open(saida,'wb').write(b.getvalue()); return q,b.tell()
    raise SystemExit('não coube')
def lum(a):
    c=a/255.0; c=np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
    return 0.2126*c[...,0]+0.7152*c[...,1]+0.0722*c[...,2]
def contraste(arq, alfa):
    im=np.asarray(Image.open(arq).convert('RGB')).astype(float)
    P=np.array([0xd9,0xcd,0xb8],float)
    mix=np.round((1-alfa)*P+alfa*im)
    L=lum(mix).ravel()
    p1,p99=np.percentile(L,1),np.percentile(L,99)
    out={}
    for nome,hexa in (('texto','2b2620'),('titulo','333a56')):
        t=lum(np.array([[int(hexa[i:i+2],16) for i in (0,2,4)]],float))[0]
        out[nome]=((p1+.05)/(t+.05),(p99+.05)/(t+.05))
    return out
if __name__=='__main__':
    print(contraste(sys.argv[1], float(sys.argv[2])))
