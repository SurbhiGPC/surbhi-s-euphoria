<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared navigation, footer, and route metadata helpers in a shared portfolio module so every public page has a consistent shell.
- Keep illustrative pricing and attendee limits in a pure budget module with domain tests; estimates are not binding quotes.
- Use global semantic design tokens and CSS motion with reduced-motion support for all portfolio visuals.
- Pre-optimize React runtimes and shared UI dependencies in Vite so first-load dependency discovery does not replace the React instance during preview hydration.
