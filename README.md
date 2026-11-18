# TaskBuddies.Landing

taskbuddies.net için statik tanıtım sitesi (TR `/`, EN `/en/`).

Ayrıca iki işi var:
- `/.well-known/apple-app-site-association` ve `/.well-known/assetlinks.json`: iOS Universal Links ve Android App Links doğrulaması. Uygulama `taskbuddies.net` alan adını davet ve şifre sıfırlama bağlantıları için kullanıyor; bu dosyalar olmadan bağlantılar uygulamada açılmaz. İçerik `api.taskbuddies.net` üzerindekilerle aynı; orada değişirse buraya da kopyala.
- `/invitations/*`, `/register`, `/reset-password`, `/accept-invitation`: bağlantı uygulamada açılmazsa `open.html` gösterilir. Telefonda "Uygulamada aç" düğmesi (iOS `taskbuddies://`, Android paket hedefli `intent://`) ve mağaza bağlantıları; metin yola göre (davet / şifre sıfırlama).

## Yayınlama (Coolify)

1. Bu klasörü bir Git deposuna koy (ör. `taskbuddies/TaskBuddies.Landing`).
2. Coolify → yeni kaynak → Dockerfile ile (bu klasördeki `Dockerfile`), port 80.
3. Alan adı: `https://taskbuddies.net` ve `https://www.taskbuddies.net` (www → kök yönlendirmesi).
4. Kontrol:
   ```bash
   curl -sI https://taskbuddies.net/.well-known/assetlinks.json
   ```
   `200` ve `content-type: application/json` olmalı, yönlendirme olmamalı.
5. Google Search Console'a `https://taskbuddies.net/sitemap.xml` ekle.

**Otomatik deploy:** Coolify'daki uygulama (`taskbuddies-prod` → production) Git kaynağı olarak `task-buddies-api` GitHub App'ini kullanır; `main`'e her push webhook ile deploy edilir. App'in GitHub kurulumunda bu repo seçili olmalı. Kaynak "Public GitHub" olursa webhook gelmez ve her deploy elle yapılmak zorunda kalır.

**Önbellek:** `/assets/` Cloudflare'de 7 gün önbellekte kalır. Bir görseli aynı adla değiştirirsen HTML'deki adresinin `?v=` sürümünü artır (`build.mjs` ve üretilen sayfalar).

## Yerel önizleme

```bash
docker build -t tb-landing . && docker run --rm -p 8080:80 tb-landing
```

## Sayfaları üretmek

`index.html` ve `en/index.html` elle düzenlenmez; metinler ve şablon `build.mjs` içinde:

```bash
node build.mjs
```

Ekran görüntüleri `assets/screens/` altında, mobil reponun `artifacts/store-screenshots/android/<dil>/` dosyalarından kırpıldı.
