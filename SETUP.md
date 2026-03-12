# AI CRM Setup Guide

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Configuration (Optional - for AI features)
GROQ_API_KEY=your_groq_api_key_here
```

## Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Supabase Auth Configuration

### 1. Configure Site URL
In your Supabase project settings:
- Go to Authentication → URL Configuration
- Set **Site URL** to: `http://localhost:3000`
- Add **Redirect URLs**:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/dashboard`

### 2. Enable Email Authentication
- Go to Authentication → Providers
- Enable **Email** provider
- Configure email templates if needed

### 3. Database Setup
Run the SQL scripts in the `scripts/` folder in order:
1. `01-create-crm-schema.sql`
2. `02-seed-sample-data.sql`
3. `03-fix-profile-rls.sql`
4. `04-create-test-user.sql`
5. `05-simple-test-user.sql`
6. `06-create-admin-user.sql`
7. `07-add-user-approval-system.sql`
8. `08-seed-admin-and-sales-data.sql`
9. `09-create-working-users.sql`
10. `10-fix-admin-login.sql`

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Testing Authentication

### Test Users (after running SQL scripts)
- **Admin**: `admin@crm.com` / `admin123`
- **Sales Rep**: `sales@crm.com` / `sales123`

### Sign Up Flow
1. Go to `/auth/sign-up`
2. Fill out the form
3. Account will be created in `pending_users` table
4. Admin needs to approve the account
5. User can then sign in

## Troubleshooting

### Common Issues

1. **"Supabase is not configured" error**
   - Check that all environment variables are set in `.env.local`
   - Restart the development server after adding env vars

2. **Auth callback errors**
   - Ensure redirect URLs are configured in Supabase
   - Check that Site URL is set to `http://localhost:3000`

3. **Database connection errors**
   - Verify Supabase credentials are correct
   - Check that RLS policies are properly set up

4. **Profile not found errors**
   - Run the SQL scripts to create the database schema
   - Check that the `profiles` table exists and has proper RLS policies

### Debug Mode
Visit `/api/_supabase-diagnostics` to check your Supabase configuration.


