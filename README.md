# NewJersey.ng

**Print, apparel and branding. One place to choose, personalise and order.**

NewJersey.ng brings product discovery, custom production requests and order management into one platform. Customers can shop ready-designed apparel, personalise jerseys, configure print products, enquire about branding services and work with the in-house design studio.

[Visit NewJersey.ng](https://www.newjersey.ng)

## Customer experience

- **Print:** business cards, flyers, banners, stickers, labels and packaging, with product-specific specifications and pricing.
- **Apparel:** ready-designed clothing with size and colour selection. These purchases do not require artwork submission.
- **Jerseys:** team, season, home/away/third kit and size selection, with optional printed names and numbers. Personalisation charges are configured in admin.
- **Custom orders:** customer artwork and design assistance where the production job requires them.
- **Branding:** signage, vehicle graphics and branding for shops and workspaces, with enquiry-based scoping where needed.
- **Design studio:** choose INK or FORM, submit a brief and follow the request through your account.
- **Account and fulfilment:** personal orders, payment instructions, receipt submission, available PDF order documents and order updates.
- **Support:** customer conversations linked to the admin support inbox.

Guests can browse products and build a cart before signing in. The cart is saved in the current browser; cross-device cart synchronisation is not implemented. An account is required for protected customer actions and records.

## Admin workspace

The admin area manages products, apparel, jerseys, print and branding catalogue entries, enquiries, orders, payments, artwork, design requests, production, delivery and support.

Access is role-based: owner, admin and production. Server-side checks enforce permissions; hiding a navigation item is not an access control.

Newsletter signup requests are collected separately from customer accounts. Requests remain pending email verification. Campaign sending and email ownership verification are not yet connected.

## Technology

| Layer | Stack |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling and interaction | Tailwind CSS 4, Framer Motion, Lucide and React Icons |
| Authentication and database | Supabase Auth and PostgreSQL |
| File storage | Supabase Storage |
| PDF generation | pdf-lib and fontkit |
| Hosting | Vercel |

## Local development

Use Node.js 22.x to match the configured Vercel runtime, and npm.

```bash
npm ci
```

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
```

The public client also accepts `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. If both public key variables exist, the publishable key takes precedence. Use keys belonging to the same Supabase project.

Never expose the service role key in browser code or prefix it with `NEXT_PUBLIC_`. Environment files and real credentials do not belong in Git.

The application expects its database tables, functions, policies and storage setup to exist. Review the SQL files under `supabase/migrations` against the target database before applying them. These files include incremental changes and should not be assumed to bootstrap every existing table from an empty database. Do not rerun data migrations blindly on an established production project.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Checks and production build

```bash
npm run lint
npm run build
npm start
```

There is no `npm test` script in the supplied package configuration. Check any scripts under `tests` individually before running them; do not point tests that modify data at production.

## Deployment

Production deploys from the `main` branch of `tripleAay/newjersey-ng`.

Configure the Supabase variables in the Vercel project's **Production** environment before building. Local `.env.local` values are not automatically transferred to Vercel. Create a new deployment after changing environment variables, including public values used during the build.

Use a separate database and environment configuration for previews that should not write to production.

```bash
git push origin main
```

After deployment, check product loading, guest cart behaviour, sign-in/sign-out, protected account routes, order creation, payment instructions and admin permissions.

## Project structure

```text
app/
  components/          Landing page, storefront and admin interfaces
  contexts/            Shared cart and client state
  lib/newjersey/       Authentication, catalogue and workflow logic
  shop/                Storefront and customer routes
  admin/               Staff workspace
  api/                 Server endpoints
public/                Public images and static assets
supabase/migrations/   Database changes
```

## Operational notes

- Checkout and server actions must validate prices and selections independently of the browser cart.
- Personalisation must preserve the customer's confirmed spelling, capitalisation and number formatting.
- Artwork approval applies to jobs that require artwork; ordinary apparel and configured jerseys follow their own workflow.
- Bank-transfer receipts are evidence for review, not automatic proof of a verified payment.
- Product imagery must use valid local assets or approved Supabase image hosts.
- Newsletter records collected before email verification must not be treated as confirmed campaign recipients.

## Ownership and contact

NewJersey.ng is a business platform maintained by [tripleAay](https://github.com/tripleAay).

**Website:** [www.newjersey.ng](https://www.newjersey.ng)  
**Email:** [hello@newjersey.ng](mailto:hello@newjersey.ng)  
**WhatsApp:** [+234 808 957 0493](https://wa.me/2348089570493)

No open-source licence is granted by this README. Do not assume that the source code, brand assets or customer content may be reused merely because the repository is publicly visible.
