# Kanaka Sweets & Bakery

Online store for **Kanaka Sweets & Bakery, Vijayawada**: a family-run sweet shop and bakery.
Customers browse Sweets, Cakes, Snacks and Festival Boxes, order for **home delivery or shop
pickup**, and pay online with **Razorpay (test mode)**. The owner manages products, prices, stock,
orders and the festival highlight from a protected **admin panel**.

This is a test project built for the Hampox Developer Round 2 brief. All shop data is example data.

## Tech stack

| Part | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4, two fonts (Fraunces + Jost) via `next/font` |
| Database | PostgreSQL on **Supabase, Mumbai (ap-south-1)**, accessed only from the server with **Prisma 6** |
| Admin login | Better Auth (email + password, no public sign-up) |
| Validation | Zod, on the server |
| Payments | Razorpay (test mode) |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`) |
| Image uploads | Cloudinary |
| Cart | Zustand (saved in the browser) |
| Hosting | Vercel, function region `bom1` (Mumbai) |
| Package manager | pnpm |

## Run it on your computer

You need **Node.js 20+**, **pnpm**, and a PostgreSQL database (a free Supabase project, or local Postgres).

```bash
pnpm install                      # also runs "prisma generate"
cp .env.example .env              # then fill in the values (see the table below)

pnpm exec prisma db push          # create the tables
pnpm exec prisma db execute --file prisma/rls.sql --schema prisma/schema.prisma   # lock the database down
pnpm exec prisma db seed          # example categories, products, festival highlight
pnpm create-admin                 # makes the admin account (see "Admin login")

pnpm dev                          # http://localhost:3000
```

Production build, the same way Vercel builds it:

```bash
pnpm build
pnpm start
```

## Environment variables

Copy `.env.example` to `.env`. **Never commit `.env`** (it is in `.gitignore`). Only the **names** are
listed here. None of these values are ever sent to the browser.

| Name | What it is | Where to get it |
| --- | --- | --- |
| `DATABASE_URL` | Database connection the app uses while running (Supabase **pooler**, port 6543, ends with `?pgbouncer=true`) | Supabase: Project Settings, Database, Connection string, "Transaction pooler" |
| `DIRECT_URL` | Direct database connection, used only by `prisma db push` and other migrations (port 5432) | Supabase: same page, "Direct connection" or "Session pooler" |
| `BETTER_AUTH_SECRET` | Long random text that signs the admin login cookie | Generate one: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Address of the site (`http://localhost:3000` locally, your real address in production) | You choose |
| `NEXT_PUBLIC_APP_URL` | Public address of the site, no trailing slash. Used for link previews, the sitemap and robots.txt | You choose |
| `ADMIN_EMAIL` | Email for the admin account made by `pnpm create-admin` | You choose |
| `ADMIN_PASSWORD` | Admin password. **Leave empty** and `pnpm create-admin` generates a strong one and saves it in `.env` | Optional |
| `RAZORPAY_KEY_ID` | Razorpay **test** key id (starts with `rzp_test_`) | Razorpay dashboard, Test mode, Settings, API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay **test** key secret | Same place |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis address for rate limiting | upstash.com, create a Redis database, "REST API" |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | Same place |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name, for admin image uploads | cloudinary.com dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Same place |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Same place |

If a variable is missing the site still starts, but that feature is limited:

- No **Upstash** keys: rate limiting works only inside one server (fine on your computer, **not enough in production**).
- No **Cloudinary** keys: admin uploads answer "not set up yet". You can still paste an image link from `images.unsplash.com` or `res.cloudinary.com`.
- No **Razorpay** keys: checkout creates the order but the payment step shows an error.

## Admin login

The admin panel is at `/admin`. There is **no sign-up page**. Create the admin once:

```bash
pnpm create-admin
```

It uses `ADMIN_EMAIL` (default `admin@kanakasweets.example`). If `ADMIN_PASSWORD` is empty it makes a strong
password and saves it in your `.env` file (it is not printed). Run it again any time to reset the password.

From the admin you can: add, edit and remove products; change prices, sizes and **stock**; view all orders
(customer details, items, amount, payment status); and switch the **festival highlight** on or off and edit its
text and image.

## Testing a payment (Razorpay test mode)

1. Put your **test** keys in `.env` and restart the server.
2. Add a product to the cart, go to checkout, fill the form and press **Place Order**.
3. In the Razorpay window use a [Razorpay test card or test UPI](https://razorpay.com/docs/payments/payments/test-card-details/).
4. The order page changes to "Payment received" only after the **server** verifies the signature.

## Useful commands

| Command | What it does |
| --- | --- |
| `pnpm dev` / `pnpm build` / `pnpm start` | Run, build, run the build |
| `pnpm lint` | Code check |
| `pnpm create-admin` | Create or reset the admin account |
| `pnpm check:rls` | Checks the database lock-down (Row Level Security on every table) |
| `pnpm scan:secrets` | Looks for secrets in the repo, the whole git history and the browser JavaScript. Run `pnpm build` first |
| `pnpm check:links` | Finds broken pages, links and images (server must be running) |
| `pnpm test:payments` | Proves fake payment calls leave orders unpaid (server must be running with the same `RAZORPAY_KEY_SECRET`) |
| `pnpm test:admin` | Proves the admin is protected on the server and uploads are limited |
| `pnpm test:admin-crud` | Proves the admin panel really changes products, stock and the festival highlight |
| `pnpm test:rate-limits` | Proves too many requests get a 429 |

The test commands talk to a running server. Start one in another terminal and, if it is not on port 3000, set
`BASE_URL`, for example `BASE_URL=http://localhost:3001 pnpm test:admin`.

## Deploy on Vercel

1. Push the code to GitHub and import the repository in Vercel. `vercel.json` already sets the function
   region to **`bom1` (Mumbai)**, next to the database.
2. In Vercel, Settings, Environment Variables, add every name from the table above with your real values.
   Set `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to your Vercel address (for example `https://your-project.vercel.app`).
3. From your computer, with `DIRECT_URL` pointing at Supabase, run the three database commands from
   "Run it on your computer" (`db push`, `rls.sql`, `db seed`) and `pnpm create-admin`.
4. Deploy. Then open the site, add an item, and pay with a test card.
5. Run `pnpm check:rls` against Supabase to confirm every table is locked.

> **Supabase free projects pause when idle.** If the site shows errors after a quiet week, open the
> Supabase dashboard and press "Restore". **Wake the project before submitting or demoing.**

> Not tried on Vercel from this repository yet: the first deploy is the first real test of the Prisma setup
> (`postinstall` runs `prisma generate`, and `next.config.ts` includes the engine files). If the build fails
> on Prisma, check the Vercel build log first.

## How it is built (the parts reviewers ask about)

- **Prices come from the server.** The cart only stores product ids, size ids and quantities. `/api/checkout`
  loads prices from the database, adds them up, and creates the Razorpay order for that total. Any price sent
  by the browser is ignored. (`src/lib/orders.ts`, `src/lib/payments.ts`)
- **Payments are verified on the server.** An order becomes `PAID` only after the server recomputes
  `HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)` and it matches the signature
  (timing-safe compare). (`src/lib/razorpay.ts`, `/api/payments/verify`)
- **Stock is reserved when the order is created**, inside one database transaction, so two buyers cannot pay for
  the last item. An unpaid order gives the stock back after 30 minutes. If a payment arrives after that, stock is
  checked again and, if it is gone, the order is flagged `REFUND NEEDED` for the owner.
- **Admin is protected on the server.** Every admin page and every `/api/admin/*` handler checks the login
  itself (`src/lib/admin-guard.ts`). `src/proxy.ts` adds a quick redirect, but removing it would not expose anything.
- **The browser never talks to the database.** Row Level Security is on for every table with no policies, and
  the Supabase `anon` / `authenticated` roles have no table access (`prisma/rls.sql`).
- **Rate limits** (per 10 minutes): admin login 10 per IP and 5 per email, checkout 10, create payment 20,
  verify payment 30 (`src/lib/rate-limit.ts`).
- **Uploads** accept only JPEG, PNG or WebP up to 2 MB, checked by size, declared type and the file's real
  first bytes (`src/lib/uploads.ts`).
- **Speed:** pages are cached and refreshed when the admin saves (`use cache` + tags). Real content is in the first
  HTML. Images go through `next/image`, only the first hero banner loads at first, the map and the Razorpay
  window load only when needed.

## Project structure

```
src/
  app/              pages and API routes (App Router)
    admin/          admin pages and login
    api/            checkout, cart, payments, admin APIs
    [category]/     category and product pages
  components/       reusable UI (cart, checkout form, admin forms, map...)
  lib/              server logic: orders, payments, auth, admin, rate limit, validation
  data/             example data used only by the database seed
  proxy.ts          first redirect for /admin pages
prisma/             schema, seed, rls.sql (database lock-down)
scripts/            create-admin and the test / check commands
```

## Known limits

- Unknown URLs show a "Not Found" page with `noindex` but answer HTTP 200. This is how this version of
  Next.js streams pages with caching turned on.
- Header Search and Wishlist are placeholders and do not work yet.
- If a customer pays and closes the browser before the confirmation reaches our server, the order stays
  unpaid until it expires. A Razorpay webhook would fix this; it is not part of the brief.
- Product photos are example photos: the sweets and snacks are from Wikimedia Commons (CC BY-SA, credited on
  `/credits` and in `src/data/photo-credits.ts`) and the cakes are from Unsplash. Replace them with the shop's own
  photos from the admin panel (and remove the matching rows from the credits file).
