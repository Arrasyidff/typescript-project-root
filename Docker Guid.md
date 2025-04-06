# Docker Guide

Panduan singkat untuk menggunakan Docker dengan aplikasi ini.

## Development

### Memulai aplikasi dengan hot-reload
```bash
npm run docker:dev
```

### Build image development
```bash
npm run docker:dev:build
```

## Production

### Build image production
```bash
npm run docker:prod:build
```

### Menjalankan di production mode
```bash
npm run docker:prod
```

## Perintah Umum

### Menghentikan container
```bash
npm run docker:down
```

### Melihat logs
```bash
npm run docker:logs
```

## Penggunaan di Mac

Jika port 80 sudah digunakan di Mac, ubah port di `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8080:80"  # Ubah ke port 8080
```

Kemudian akses via http://localhost:8080