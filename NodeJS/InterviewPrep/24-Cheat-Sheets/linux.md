# Linux Cheat Sheet

```bash
ps aux | rg node
ss -ltnp
top
df -h && free -h
journalctl -u app -f
curl -i http://localhost:3000/health
```
Use least privilege; inspect logs and limits before restarting services.
