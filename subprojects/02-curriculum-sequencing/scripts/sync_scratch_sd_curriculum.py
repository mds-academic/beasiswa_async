"""Integrate the approved Scratch SD bridge/video sequence into all LMS mirrors."""
from pathlib import Path
import json, shutil

ROOT = Path(__file__).resolve().parents[1]
BRIDGE_DIR = ROOT / 'slides'
SRC = ROOT.parent / '01-lms-platform' / 'src'
DOCS = ROOT.parent.parent / 'docs'

playlists = {
    'about-me': [
        ('pmSYmmRe4Sw','1 About Me - Mendesain Karakter'),('a7VMYsnvmQY','2 About Me - Merekam Suara Perkenalan Diri'),('pAWCUOSOHAk','3 About Me - Membuat Kostum Makanan'),('odzpfqdxTEc','4 About Me - Memprogram Sprite Makanan'),('EsBPZR9k4X8','5 About Me - Menambahkan Sprite dengan Emoji'),('8PPKejwfq4k','6 About Me - Memprogram Animasi dan Menggunakan Text-to-Speech'),('RMwzg1MtZFg','7 About Me - Memprogram dengan Effects')],
    'racing-car': [
        ('qHSNKAw2tLc','1 Desain Sirkuit'),('QAJXUrjmetI','2 Desain Mobil'),('lIekdk-dDTw','3 Kode Mobil'),('3zubM7bbNTI','4 Duplikasi dan Modifikasi Mobil 2'),('sm1DkpQpRxw','5 Desain Finish Line'),('qnzD9G15BqE','6 Kode Menang dan Menyentuh Musuh')],
    'increase-earning': [
        ('5u7OdPWmJhU','1. Percakapan Intro'),('rb8wuLoVnic','2. Memprogram Opsi 1'),('t5YIkeWux3U','3. Memprogram Opsi 2'),('A1SrFU4pDY4','4. Memprogram Ending')]
}

def quiz(title):
    return [{'time': 0, 'shown': False, 'resume': False, 'title': f'Checkpoint: {title}', 'questions': [{'id': f'q-{title.lower().replace(" ","-")}', 'question': f'Apa fokus utama materi "{title}"?', 'options': ['Mencoba, mengamati, dan menjelaskan hasilnya', 'Menutup Scratch', 'Menghapus semua Sprite', 'Tidak melakukan apa-apa'], 'answer': 'A', 'explanation': 'Benar. Pembelajaran Scratch dilakukan dengan mencoba, mengamati, mengubah, dan menjelaskan.'}]}]

def video_step(sid, title, kicker, playlist):
    return {'id': sid, 'type': 'video', 'kicker': kicker, 'title': title, 'videoId': next(v for v,t in playlists[playlist] if t == title), 'playlistId': playlist, 'quizzes': quiz(title)}

def bridge_step(meta, sid, kicker):
    d=json.loads((BRIDGE_DIR/f'{sid}.json').read_text())
    return {'id': sid, 'type':'slide', 'kicker':kicker, 'title':d['title'], 'slideUrl':d['slideUrl'], 'embedUrl':d['embedUrl'], 'summary':d['summary'], 'totalSlides':d['totalSlides'], 'learningObjectives':d['learningObjectives'], 'practice':d['practice'], 'completionCriteria':d['completionCriteria'], 'bookmarks':d['bookmarks'], 'quizzes':d['quizzes']}

modules=[
 {'id':'up-mod-00','order':0,'title':'Modul 0: Kenalan dengan Scratch','description':'Mengenal platform Scratch, ruang kerja, blok kode, dan membuat project pertama.','steps':[bridge_step(None,'bridge-sd-00','Materi Jembatan 00 · Kenalan Scratch')]},
 {'id':'up-mod-01','order':1,'title':'Modul 1: About Me — Perkenalan Interaktif','description':'Membuat project About Me dengan Sprite, Costume, Event, Sound, dan animasi.','steps':[bridge_step(None,'bridge-sd-01','Materi Jembatan 01 · Project About Me')]+[video_step(f'up-about-{i+1}',t,'Video About Me · Tutorial', 'about-me') for i,(v,t) in enumerate(playlists['about-me'])]},
 {'id':'up-mod-02','order':2,'title':'Modul 2: Loop dan Animasi','description':'Memahami pengulangan dan menggunakannya untuk membuat gerak serta animasi.','steps':[bridge_step(None,'bridge-sd-02','Materi Jembatan 02 · Loop dan Animasi')]},
 {'id':'up-mod-03','order':3,'title':'Modul 3: Racing Car — Logika Game','description':'Membuat game balap dengan input keyboard, loop, sensing, collision, dan conditional.','steps':[bridge_step(None,'bridge-sd-03','Materi Jembatan 03 · Logika Game')]+[video_step(f'up-racing-{i+1}',t,'Video Racing Car · Tutorial', 'racing-car') for i,(v,t) in enumerate(playlists['racing-car'])]},
 {'id':'up-mod-04','order':4,'title':'Modul 4: Variable dan Koordinasi Project','description':'Memahami nilai yang berubah, broadcast, backdrop sebagai scene, dan alur project.','steps':[bridge_step(None,'bridge-sd-04','Materi Jembatan 04 · Data dan Koordinasi')]},
 {'id':'up-mod-05','order':5,'title':'Modul 5: Increase Your Earnings — Capstone','description':'Mengikuti project integratif dengan pilihan aktivitas, credit, scene, clone, dan ending.','steps':[video_step(f'up-earning-{i+1}',t,'Video Increase Your Earnings · Capstone', 'increase-earning') for i,(v,t) in enumerate(playlists['increase-earning'])]}
]
data={'levelId':'upper_primary','levelTitle':'Scratch Async SD (UOB My Digital Space)','description':'Kurikulum Scratch berbasis project terpisah: About Me, Racing Car, dan Increase Your Earnings, dengan bridge scaffolding dari platform dasar hingga project integratif.','isPlaceholder':False,'modules':modules}
for target in [ROOT/'output/courseData-upperprimary.json', SRC/'data/courseData-upperprimary.json', DOCS/'data/courseData-upperprimary.json']:
    target.parent.mkdir(parents=True,exist_ok=True); target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
for target_root in [SRC, DOCS]:
    (target_root/'slides').mkdir(parents=True, exist_ok=True)
    for f in BRIDGE_DIR.glob('bridge-sd-*.html'): shutil.copy2(f,target_root/'slides'/f.name)
    for f in BRIDGE_DIR.glob('bridge-sd-*.json'): shutil.copy2(f,target_root/'slides'/f.name)
    for f in (ROOT/'assets'/'scratch').glob('*'):
        (target_root/'assets'/'scratch').mkdir(parents=True,exist_ok=True); shutil.copy2(f,target_root/'assets'/'scratch'/f.name)
print('Integrated',sum(len(m['steps']) for m in modules),'steps across',len(modules),'modules into 3 mirrors.')
