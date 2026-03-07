-- ============================================================
-- 프로필(역할) 테이블: 관리자/일반 사용자 구분
-- Supabase 대시보드 → SQL Editor에서 이 스크립트를 실행하세요.
-- ============================================================

-- 1. 프로필 테이블 생성
-- auth.users와 1:1, 역할(role)은 DB에서만 수동으로 'admin' 설정
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. 코멘트 (선택)
COMMENT ON TABLE public.profiles IS '사용자 프로필 및 역할(관리자/일반). 관리자는 DB에서만 role=admin으로 설정';
COMMENT ON COLUMN public.profiles.role IS 'user: 일반, admin: 관리자(대시보드/SQL에서만 설정)';

-- 3. 가입 시 자동으로 프로필 행 생성 (역할은 기본 'user')
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'user'
  );
  RETURN new;
END;
$$;

-- 기존 트리거가 있으면 제거 후 재생성 (이미 있다면 이 줄에서 에러 날 수 있음 → 수동으로 DROP TRIGGER 후 재실행)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. 정책: 본인 프로필만 조회 가능
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 6. 정책: 본인 프로필만 수정 가능 (이름 등). role 컬럼은 앱에서 수정하지 말 것 → 관리자는 대시보드/SQL로만 설정
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 7. (선택) 기존 auth.users에 이미 있는 사용자에게 프로필 생성
-- INSERT INTO public.profiles (id, email, full_name, role)
-- SELECT id, email, raw_user_meta_data->>'full_name', 'user'
-- FROM auth.users
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 관리자로 지정하는 방법 (Supabase 대시보드에서)
-- ============================================================
-- Table Editor → profiles → 해당 사용자 행의 role 값을 'admin'으로 변경
-- 또는 SQL Editor에서:
--
--   UPDATE public.profiles
--   SET role = 'admin', updated_at = now()
--   WHERE id = '여기에-사용자-uuid';
--
