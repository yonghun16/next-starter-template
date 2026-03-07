# Supabase 설정 (관리자/일반 계정)

## 1. 프로필 테이블 생성

Supabase 대시보드 → **SQL Editor**에서 아래 파일 내용을 실행하세요.

- `migrations/20250101000000_create_profiles_role.sql`

또는 터미널에서 Supabase CLI로:

```bash
supabase db push
```

실행 후 다음이 생성됩니다.

- **`public.profiles`** 테이블  
  - `id` (uuid, auth.users와 1:1)  
  - `email`, `full_name`  
  - **`role`** : `'user'` | `'admin'` (기본값 `'user'`)  
  - `created_at`, `updated_at`
- **가입 시 자동 생성**  
  - `auth.users`에 INSERT 될 때 트리거로 `profiles`에 한 행이 생기고, `role = 'user'` 로 설정됩니다.
- **RLS**  
  - 본인 프로필만 조회/수정 가능. 관리자 지정은 DB(대시보드 또는 SQL)에서만 합니다.

## 2. 관리자로 지정하는 방법

**방법 A – Table Editor**

1. Supabase 대시보드 → **Table Editor** → **profiles**
2. 관리자로 둘 사용자 행에서 **role** 컬럼을 `admin`으로 변경 후 저장

**방법 B – SQL Editor**

```sql
-- 이메일로 지정할 때 (예시)
UPDATE public.profiles
SET role = 'admin', updated_at = now()
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');

-- 또는 사용자 UUID를 알고 있을 때
UPDATE public.profiles
SET role = 'admin', updated_at = now()
WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

## 3. 이미 가입한 사용자가 있는 경우

마이그레이션을 **처음** 실행한 뒤, 이미 `auth.users`에만 있고 `profiles`에는 없는 사용자가 있다면 아래를 한 번 실행하세요.

```sql
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'), 'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

이후 가입하는 사용자는 트리거로 자동으로 `profiles`에 추가됩니다.

## 4. 앱 동작 요약

- **일반 사용자** (`role = 'user'`)  
  - 헤더: HOME, 로그아웃  
  - `/admin` 접속 시 "접근 권한이 없습니다" 후 메인으로 이동
- **관리자** (`role = 'admin'`)  
  - 헤더: HOME, **관리자**, 로그아웃  
  - `/admin` 접속 가능

관리자 계정은 위 2번 방법으로 **DB에서만** 설정합니다. 앱에서는 `role`을 `admin`으로 바꾸는 UI를 제공하지 않습니다.
