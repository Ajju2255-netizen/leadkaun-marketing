import { permanentRedirect } from "next/navigation"
import { APP_URLS } from "@/lib/urls"

// The demo / booking flow was retired in favour of product-led self-serve.
// Anyone landing on /demo (old links, bookmarks, search results) goes straight
// to Start Free — into the platform.
export default function DemoRedirect() {
  permanentRedirect(APP_URLS.register)
}
