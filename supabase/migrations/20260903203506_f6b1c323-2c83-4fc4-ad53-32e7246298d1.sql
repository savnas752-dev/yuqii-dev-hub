-- roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  discord_id text UNIQUE,
  discord_username text NOT NULL DEFAULT 'user',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles own insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles own update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Minecraft Mod',
  short_description text NOT NULL DEFAULT '',
  overview text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  technologies text[] NOT NULL DEFAULT '{}',
  minecraft_version text,
  mod_loader text,
  challenges text,
  solutions text,
  learnings text,
  github_url text,
  download_url text,
  demo_url text,
  release_info text,
  changelog text,
  image_key text NOT NULL DEFAULT 'PROJECT_IMAGE',
  image_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects public read" ON public.projects FOR SELECT USING (published);
CREATE POLICY "projects admin read" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "projects admin write" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- project images
CREATE TABLE public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_key text NOT NULL DEFAULT 'PROJECT_SCREENSHOT',
  image_url text,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.project_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_images TO authenticated;
GRANT ALL ON public.project_images TO service_role;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "project images public read" ON public.project_images FOR SELECT USING (true);
CREATE POLICY "project images admin write" ON public.project_images FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- devlog
CREATE TABLE public.devlog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_key text NOT NULL DEFAULT 'DEVLOG_IMAGE',
  image_url text,
  tags text[] NOT NULL DEFAULT '{}',
  reading_minutes integer NOT NULL DEFAULT 3,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.devlog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.devlog_posts TO authenticated;
GRANT ALL ON public.devlog_posts TO service_role;
ALTER TABLE public.devlog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "devlog public read" ON public.devlog_posts FOR SELECT USING (published);
CREATE POLICY "devlog admin read" ON public.devlog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "devlog admin write" ON public.devlog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER devlog_updated_at BEFORE UPDATE ON public.devlog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- reviews
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected', 'hidden');

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  rating smallint NOT NULL,
  body text NOT NULL,
  status public.review_status NOT NULL DEFAULT 'pending',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_body_length CHECK (char_length(btrim(body)) BETWEEN 10 AND 1500)
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read approved" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "reviews own read" ON public.reviews FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "reviews admin read" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "reviews own insert" ON public.reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND status = 'pending' AND featured = false);
CREATE POLICY "reviews own update" ON public.reviews FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid() AND status = 'pending' AND featured = false);
CREATE POLICY "reviews own delete" ON public.reviews FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "reviews admin write" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- rate limiting: max 1 review write per minute per user
CREATE OR REPLACE FUNCTION public.reviews_rate_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.updated_at > now() - interval '30 seconds' THEN
    RAISE EXCEPTION 'Please wait a moment before updating your review again.';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER reviews_rate_limit_trg BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.reviews_rate_limit();

-- site settings
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- seed content
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{"name":"Yuqii","headline":"Minecraft Developer • Builder • Technical Specialist","description":"I build Minecraft mods and technical projects with Java and Gradle, while also working with Minecraft and PC troubleshooting.","status":"Currently Building"}'::jsonb),
('about', '{"paragraphs":["I''m a developer who enjoys building things from the ground up. I primarily work on Minecraft mods and enjoy the technical side of development, from Java and Gradle builds to creating systems that actually work in-game.","Outside of development, my experience in active service has helped me develop discipline, accountability, teamwork, responsibility, and the ability to stay focused under pressure.","I also work with Minecraft PC checking and technical troubleshooting, investigating configurations, software, logs, performance issues, and other technical problems."]}'::jsonb),
('currently', '{"building":"Minecraft projects","learning":"PLACEHOLDER — Add what you are learning here.","focus":"Minecraft development","status":"Building"}'::jsonb),
('stats', '{"projects":"00+","mods":"00+","years_building":"00+","current_status":"Building"}'::jsonb),
('contact', '{"discord_username":"ittz.ozzy","discord_url":"https://discord.com/users/ittz.ozzy"}'::jsonb),
('images', '{"PROFILE_IMAGE":null,"HERO_IMAGE":null}'::jsonb);

INSERT INTO public.projects (slug, name, category, short_description, overview, technologies, minecraft_version, mod_loader, challenges, solutions, learnings, image_key, release_info, changelog, sort_order) VALUES
('project-01', 'Project 01', 'Minecraft Mod', 'PLACEHOLDER — Add project description here.', 'PLACEHOLDER — Add the full project overview here.', ARRAY['Java','Gradle','Minecraft'], 'PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER — Add technical challenges here.', 'PLACEHOLDER — Add how problems were solved here.', 'PLACEHOLDER — Add what was learned here.', 'PROJECT_IMAGE_1', 'PLACEHOLDER — Add release information here.', 'PLACEHOLDER — Add changelog here.', 1),
('project-02', 'Project 02', 'Minecraft Mod', 'PLACEHOLDER — Add project description here.', 'PLACEHOLDER — Add the full project overview here.', ARRAY['Java','Gradle'], 'PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER — Add technical challenges here.', 'PLACEHOLDER — Add how problems were solved here.', 'PLACEHOLDER — Add what was learned here.', 'PROJECT_IMAGE_2', 'PLACEHOLDER — Add release information here.', 'PLACEHOLDER — Add changelog here.', 2),
('project-03', 'Project 03', 'Technical Project', 'PLACEHOLDER — Add project description here.', 'PLACEHOLDER — Add the full project overview here.', ARRAY['Java','Gradle','Tools'], 'PLACEHOLDER', 'PLACEHOLDER', 'PLACEHOLDER — Add technical challenges here.', 'PLACEHOLDER — Add how problems were solved here.', 'PLACEHOLDER — Add what was learned here.', 'PROJECT_IMAGE_3', 'PLACEHOLDER — Add release information here.', 'PLACEHOLDER — Add changelog here.', 3);

INSERT INTO public.devlog_posts (slug, title, excerpt, content, image_key, tags, reading_minutes) VALUES
('building-my-next-minecraft-mod', 'Building My Next Minecraft Mod', 'PLACEHOLDER — Add a short description here.', 'PLACEHOLDER — Add the full article here.', 'DEVLOG_IMAGE_1', ARRAY['Minecraft','Java'], 4),
('improving-my-gradle-setup', 'Improving My Gradle Setup', 'PLACEHOLDER — Add a short description here.', 'PLACEHOLDER — Add the full article here.', 'DEVLOG_IMAGE_2', ARRAY['Gradle','Build'], 3),
('debugging-a-difficult-minecraft-issue', 'Debugging a Difficult Minecraft Issue', 'PLACEHOLDER — Add a short description here.', 'PLACEHOLDER — Add the full article here.', 'DEVLOG_IMAGE_3', ARRAY['Debugging','Logs'], 5);