-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resource_id" TEXT,
    "resource_type" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "actor_type" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "context" TEXT,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "role_id" TEXT,
    "integration_id" TEXT,
    "user_id" TEXT,
    "last_seen_at" DATETIME,
    "last_seen_version" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "benefits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "brute" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "firstRequest" BIGINT NOT NULL,
    "lastRequest" BIGINT NOT NULL,
    "lifetime" BIGINT NOT NULL,
    "count" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "filter" TEXT,
    "feature_image" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "collections_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collection_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "collections_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "collections_posts_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "comment_likes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "comment_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment_id" TEXT NOT NULL,
    "member_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "comment_reports_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "comment_reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "member_id" TEXT,
    "parent_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "html" TEXT,
    "edited_at" DATETIME,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "comments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "custom_theme_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "theme" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT
);

-- CreateTable
CREATE TABLE "donation_payment_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "member_id" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "attribution_id" TEXT,
    "attribution_type" TEXT,
    "attribution_url" TEXT,
    "referrer_source" TEXT,
    "referrer_medium" TEXT,
    "referrer_url" TEXT,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "donation_payment_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "email_batches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email_id" TEXT NOT NULL,
    "provider_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "member_segment" TEXT,
    "error_status_code" INTEGER,
    "error_message" TEXT,
    "error_data" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "email_batches_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "emails" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "email_recipient_failures" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email_id" TEXT NOT NULL,
    "member_id" TEXT,
    "email_recipient_id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "enhanced_code" TEXT,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'permanent',
    "failed_at" DATETIME NOT NULL,
    "event_id" TEXT,
    CONSTRAINT "email_recipient_failures_email_recipient_id_fkey" FOREIGN KEY ("email_recipient_id") REFERENCES "email_recipients" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "email_recipient_failures_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "emails" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "email_recipients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "processed_at" DATETIME,
    "delivered_at" DATETIME,
    "opened_at" DATETIME,
    "failed_at" DATETIME,
    "member_uuid" TEXT NOT NULL,
    "member_email" TEXT NOT NULL,
    "member_name" TEXT,
    CONSTRAINT "email_recipients_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "email_batches" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "email_recipients_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "emails" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "email_spam_complaint_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "email_spam_complaint_events_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "emails" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "email_spam_complaint_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "emails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "recipient_filter" TEXT NOT NULL,
    "error" TEXT,
    "error_data" TEXT,
    "email_count" INTEGER NOT NULL DEFAULT 0,
    "delivered_count" INTEGER NOT NULL DEFAULT 0,
    "opened_count" INTEGER NOT NULL DEFAULT 0,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "subject" TEXT,
    "from" TEXT,
    "reply_to" TEXT,
    "html" TEXT,
    "plaintext" TEXT,
    "source" TEXT,
    "source_type" TEXT NOT NULL DEFAULT 'html',
    "track_opens" BOOLEAN NOT NULL DEFAULT false,
    "track_clicks" BOOLEAN NOT NULL DEFAULT false,
    "feedback_enabled" BOOLEAN NOT NULL DEFAULT false,
    "submitted_at" DATETIME NOT NULL,
    "newsletter_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT,
    CONSTRAINT "emails_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'custom',
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon_image" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires" BIGINT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "started_at" DATETIME,
    "finished_at" DATETIME,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "labels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT,
    "transient_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'free',
    "name" TEXT,
    "expertise" TEXT,
    "note" TEXT,
    "geolocation" TEXT,
    "enable_comment_notifications" BOOLEAN NOT NULL DEFAULT true,
    "email_count" INTEGER NOT NULL DEFAULT 0,
    "email_opened_count" INTEGER NOT NULL DEFAULT 0,
    "email_open_rate" INTEGER,
    "email_disabled" BOOLEAN NOT NULL DEFAULT false,
    "last_seen_at" DATETIME,
    "last_commented_at" DATETIME,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "members_cancel_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "from_plan" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_cancel_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_click_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "redirect_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_click_events_redirect_id_fkey" FOREIGN KEY ("redirect_id") REFERENCES "redirects" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "members_click_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_created_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL,
    "member_id" TEXT NOT NULL,
    "attribution_id" TEXT,
    "attribution_type" TEXT,
    "attribution_url" TEXT,
    "referrer_source" TEXT,
    "referrer_medium" TEXT,
    "referrer_url" TEXT,
    "source" TEXT NOT NULL,
    "batch_id" TEXT,
    CONSTRAINT "members_created_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_email_change_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "to_email" TEXT NOT NULL,
    "from_email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_email_change_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "score" INTEGER NOT NULL DEFAULT 0,
    "member_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    CONSTRAINT "members_feedback_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "members_feedback_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_labels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "label_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "members_labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "labels" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "members_labels_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_login_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_login_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_newsletters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "newsletter_id" TEXT NOT NULL,
    CONSTRAINT "members_newsletters_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "members_newsletters_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_paid_subscription_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT,
    "member_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "from_plan" TEXT,
    "to_plan" TEXT,
    "currency" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "mrr_delta" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_paid_subscription_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_payment_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_payment_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_product_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "action" TEXT,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_product_events_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "members_product_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "expiry_at" DATETIME,
    CONSTRAINT "members_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "members_products_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_status_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "from_status" TEXT,
    "to_status" TEXT,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "members_status_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_stripe_customers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT,
    CONSTRAINT "members_stripe_customers_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_stripe_customers_subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "ghost_subscription_id" TEXT,
    "subscription_id" TEXT NOT NULL,
    "stripe_price_id" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "cancellation_reason" TEXT,
    "current_period_end" DATETIME NOT NULL,
    "start_date" DATETIME NOT NULL,
    "default_payment_card_last4" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT,
    "mrr" INTEGER NOT NULL DEFAULT 0,
    "offer_id" TEXT,
    "trial_start_at" DATETIME,
    "trial_end_at" DATETIME,
    "plan_id" TEXT NOT NULL,
    "plan_nickname" TEXT NOT NULL,
    "plan_interval" TEXT NOT NULL,
    "plan_amount" INTEGER NOT NULL,
    "plan_currency" TEXT NOT NULL,
    CONSTRAINT "members_stripe_customers_subscriptions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "members_stripe_customers_subscriptions_ghost_subscription_id_fkey" FOREIGN KEY ("ghost_subscription_id") REFERENCES "subscriptions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "members_stripe_customers_subscriptions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "members_stripe_customers" ("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_subscribe_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "member_id" TEXT NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL,
    "source" TEXT,
    "newsletter_id" TEXT,
    CONSTRAINT "members_subscribe_events_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "members_subscribe_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "members_subscription_created_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL,
    "member_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "attribution_id" TEXT,
    "attribution_type" TEXT,
    "attribution_url" TEXT,
    "referrer_source" TEXT,
    "referrer_medium" TEXT,
    "referrer_url" TEXT,
    "batch_id" TEXT,
    CONSTRAINT "members_subscription_created_events_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "members_stripe_customers_subscriptions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "members_subscription_created_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "mentions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "source" TEXT NOT NULL,
    "source_title" TEXT,
    "source_site_title" TEXT,
    "source_excerpt" TEXT,
    "source_author" TEXT,
    "source_featured_image" TEXT,
    "source_favicon" TEXT,
    "target" TEXT NOT NULL,
    "resource_id" TEXT,
    "resource_type" TEXT,
    "created_at" DATETIME NOT NULL,
    "payload" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "migrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "currentVersion" TEXT
);

-- CreateTable
CREATE TABLE "migrations_lock" (
    "lock_key" TEXT NOT NULL PRIMARY KEY,
    "locked" BOOLEAN DEFAULT false,
    "acquired_at" DATETIME,
    "released_at" DATETIME
);

-- CreateTable
CREATE TABLE "milestones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "currency" TEXT,
    "created_at" DATETIME NOT NULL,
    "email_sent_at" DATETIME
);

-- CreateTable
CREATE TABLE "mobiledoc_revisions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "mobiledoc" TEXT,
    "created_at_ts" BIGINT NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "feedback_enabled" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "sender_name" TEXT,
    "sender_email" TEXT,
    "sender_reply_to" TEXT NOT NULL DEFAULT 'newsletter',
    "status" TEXT NOT NULL DEFAULT 'active',
    "visibility" TEXT NOT NULL DEFAULT 'members',
    "subscribe_on_signup" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "header_image" TEXT,
    "show_header_icon" BOOLEAN NOT NULL DEFAULT true,
    "show_header_title" BOOLEAN NOT NULL DEFAULT true,
    "title_font_category" TEXT NOT NULL DEFAULT 'sans_serif',
    "title_alignment" TEXT NOT NULL DEFAULT 'center',
    "show_feature_image" BOOLEAN NOT NULL DEFAULT true,
    "body_font_category" TEXT NOT NULL DEFAULT 'sans_serif',
    "footer_content" TEXT,
    "show_badge" BOOLEAN NOT NULL DEFAULT true,
    "show_header_name" BOOLEAN NOT NULL DEFAULT true,
    "show_post_title_section" BOOLEAN NOT NULL DEFAULT true,
    "show_comment_cta" BOOLEAN NOT NULL DEFAULT true,
    "show_subscription_details" BOOLEAN NOT NULL DEFAULT false,
    "show_latest_posts" BOOLEAN NOT NULL DEFAULT false,
    "background_color" TEXT NOT NULL DEFAULT 'light',
    "border_color" TEXT,
    "title_color" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "offer_redemptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offer_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "offer_redemptions_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "members_stripe_customers_subscriptions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "offer_redemptions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "offer_redemptions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "stripe_coupon_id" TEXT,
    "interval" TEXT NOT NULL,
    "currency" TEXT,
    "discount_type" TEXT NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "duration_in_months" INTEGER,
    "portal_title" TEXT,
    "portal_description" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    CONSTRAINT "offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "object_type" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "object_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "permissions_roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "permissions_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "post_revisions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "lexical" TEXT,
    "created_at_ts" BIGINT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "author_id" TEXT,
    "title" TEXT,
    "post_status" TEXT,
    "reason" TEXT,
    "feature_image" TEXT,
    "feature_image_alt" TEXT,
    "feature_image_caption" TEXT,
    CONSTRAINT "post_revisions_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mobiledoc" TEXT,
    "lexical" TEXT,
    "html" TEXT,
    "comment_id" TEXT,
    "plaintext" TEXT,
    "feature_image" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'post',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "locale" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "email_recipient_filter" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT,
    "published_at" DATETIME,
    "published_by" TEXT,
    "custom_excerpt" TEXT,
    "codeinjection_head" TEXT,
    "codeinjection_foot" TEXT,
    "custom_template" TEXT,
    "canonical_url" TEXT,
    "newsletter_id" TEXT,
    "show_title_and_feature_image" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "posts_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "posts_authors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "posts_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "posts_authors_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "posts_meta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "og_image" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "twitter_image" TEXT,
    "twitter_title" TEXT,
    "twitter_description" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "email_subject" TEXT,
    "frontmatter" TEXT,
    "feature_image_alt" TEXT,
    "feature_image_caption" TEXT,
    "email_only" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "posts_meta_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "posts_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "posts_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "posts_products_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "posts_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "post_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "posts_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "posts_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "welcome_page_url" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'none',
    "trial_days" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'paid',
    "currency" TEXT,
    "monthly_price" INTEGER,
    "yearly_price" INTEGER,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "monthly_price_id" TEXT,
    "yearly_price_id" TEXT
);

-- CreateTable
CREATE TABLE "products_benefits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "benefit_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "products_benefits_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "benefits" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "products_benefits_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "recommendation_click_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recommendation_id" TEXT NOT NULL,
    "member_id" TEXT,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "recommendation_click_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "recommendation_click_events_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "recommendation_subscribe_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recommendation_id" TEXT NOT NULL,
    "member_id" TEXT,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "recommendation_subscribe_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE SET NULL ON UPDATE NO ACTION,
    CONSTRAINT "recommendation_subscribe_events_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "featured_image" TEXT,
    "favicon" TEXT,
    "description" TEXT,
    "one_click_subscribe" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "redirects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "post_id" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    CONSTRAINT "redirects_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE SET NULL ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "roles_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_data" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "group" TEXT NOT NULL DEFAULT 'core',
    "key" TEXT NOT NULL,
    "value" TEXT,
    "type" TEXT NOT NULL,
    "flags" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "snippets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mobiledoc" TEXT NOT NULL,
    "lexical" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "stripe_prices" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripe_price_id" TEXT NOT NULL,
    "stripe_product_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "nickname" TEXT,
    "currency" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'recurring',
    "interval" TEXT,
    "description" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    CONSTRAINT "stripe_prices_stripe_product_id_fkey" FOREIGN KEY ("stripe_product_id") REFERENCES "stripe_products" ("stripe_product_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "stripe_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT,
    "stripe_product_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    CONSTRAINT "stripe_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "tier_id" TEXT NOT NULL,
    "cadence" TEXT,
    "currency" TEXT,
    "amount" INTEGER,
    "payment_provider" TEXT,
    "payment_subscription_url" TEXT,
    "payment_user_url" TEXT,
    "offer_id" TEXT,
    "expires_at" DATETIME,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    CONSTRAINT "subscriptions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "subscriptions_tier_id_fkey" FOREIGN KEY ("tier_id") REFERENCES "products" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "subscriptions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "suppressions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "email_id" TEXT,
    "reason" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "suppressions_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "emails" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "feature_image" TEXT,
    "parent_id" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "og_image" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "twitter_image" TEXT,
    "twitter_title" TEXT,
    "twitter_description" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "codeinjection_head" TEXT,
    "codeinjection_foot" TEXT,
    "canonical_url" TEXT,
    "accent_color" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "temp_mail_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "occurred_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "data" TEXT,
    "created_at" DATETIME NOT NULL,
    "updated_at" DATETIME,
    "first_used_at" DATETIME,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_image" TEXT,
    "cover_image" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "location" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "accessibility" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "locale" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "meta_title" TEXT,
    "meta_description" TEXT,
    "tour" TEXT,
    "last_seen" DATETIME,
    "comment_notifications" BOOLEAN NOT NULL DEFAULT true,
    "free_member_signup_notification" BOOLEAN NOT NULL DEFAULT true,
    "paid_subscription_started_notification" BOOLEAN NOT NULL DEFAULT true,
    "paid_subscription_canceled_notification" BOOLEAN NOT NULL DEFAULT false,
    "mention_notifications" BOOLEAN NOT NULL DEFAULT true,
    "recommendation_notifications" BOOLEAN NOT NULL DEFAULT true,
    "milestone_notifications" BOOLEAN NOT NULL DEFAULT true,
    "donation_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT
);

-- CreateTable
CREATE TABLE "webhooks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "event" TEXT NOT NULL,
    "target_url" TEXT NOT NULL,
    "name" TEXT,
    "secret" TEXT,
    "api_version" TEXT NOT NULL DEFAULT 'v2',
    "integration_id" TEXT NOT NULL,
    "last_triggered_at" DATETIME,
    "last_triggered_status" TEXT,
    "last_triggered_error" TEXT,
    "created_at" DATETIME NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_at" DATETIME,
    "updated_by" TEXT,
    CONSTRAINT "webhooks_integration_id_fkey" FOREIGN KEY ("integration_id") REFERENCES "integrations" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_secret_unique" ON "api_keys"("secret");

-- CreateIndex
CREATE UNIQUE INDEX "benefits_slug_unique" ON "benefits"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collections_slug_unique" ON "collections"("slug");

-- CreateIndex
CREATE INDEX "email_recipients_email_id_member_email_index" ON "email_recipients"("email_id", "member_email");

-- CreateIndex
CREATE INDEX "email_recipients_failed_at_index" ON "email_recipients"("failed_at");

-- CreateIndex
CREATE INDEX "email_recipients_opened_at_index" ON "email_recipients"("opened_at");

-- CreateIndex
CREATE INDEX "email_recipients_delivered_at_index" ON "email_recipients"("delivered_at");

-- CreateIndex
CREATE INDEX "email_recipients_member_id_index" ON "email_recipients"("member_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_spam_complaint_events_email_id_member_id_unique" ON "email_spam_complaint_events"("email_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "emails_post_id_unique" ON "emails"("post_id");

-- CreateIndex
CREATE INDEX "emails_post_id_index" ON "emails"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "integrations_slug_unique" ON "integrations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "invites_token_unique" ON "invites"("token");

-- CreateIndex
CREATE UNIQUE INDEX "invites_email_unique" ON "invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_name_unique" ON "jobs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "labels_name_unique" ON "labels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "labels_slug_unique" ON "labels"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "members_uuid_unique" ON "members"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "members_transient_id_unique" ON "members"("transient_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_unique" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_email_open_rate_index" ON "members"("email_open_rate");

-- CreateIndex
CREATE INDEX "members_created_events_attribution_id_index" ON "members_created_events"("attribution_id");

-- CreateIndex
CREATE INDEX "members_newsletters_newsletter_id_member_id_index" ON "members_newsletters"("newsletter_id", "member_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_stripe_customers_customer_id_unique" ON "members_stripe_customers"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "members_stripe_customers_subscriptions_subscription_id_unique" ON "members_stripe_customers_subscriptions"("subscription_id");

-- CreateIndex
CREATE INDEX "members_stripe_customers_subscriptions_stripe_price_id_index" ON "members_stripe_customers_subscriptions"("stripe_price_id");

-- CreateIndex
CREATE INDEX "members_subscription_created_events_attribution_id_index" ON "members_subscription_created_events"("attribution_id");

-- CreateIndex
CREATE UNIQUE INDEX "migrations_name_version_unique" ON "migrations"("name", "version");

-- CreateIndex
CREATE INDEX "mobiledoc_revisions_post_id_index" ON "mobiledoc_revisions"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_uuid_unique" ON "newsletters"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_name_unique" ON "newsletters"("name");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_slug_unique" ON "newsletters"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "offers_name_unique" ON "offers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "offers_code_unique" ON "offers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "offers_stripe_coupon_id_unique" ON "offers"("stripe_coupon_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_unique" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "post_revisions_post_id_index" ON "post_revisions"("post_id");

-- CreateIndex
CREATE INDEX "posts_published_at_index" ON "posts"("published_at");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_type_unique" ON "posts"("slug", "type");

-- CreateIndex
CREATE UNIQUE INDEX "posts_meta_post_id_unique" ON "posts_meta"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_unique" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_unique" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_id_unique" ON "sessions"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_unique" ON "settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "snippets_name_unique" ON "snippets"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_prices_stripe_price_id_unique" ON "stripe_prices"("stripe_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "stripe_products_stripe_product_id_unique" ON "stripe_products"("stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "suppressions_email_unique" ON "suppressions"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_unique" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tokens_token_index" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_slug_unique" ON "users"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

