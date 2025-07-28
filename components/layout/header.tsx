"use client"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "@/contexts/theme-context"
import { AccessibleButton } from "@/components/ui/accessible-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Calendar, Search, Bell, User, Settings, LogOut, Menu, Sun, Moon, Monitor } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const { user, profile, signOut } = useAuth()
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()

  const navigation = [
    { name: t("nav.dashboard"), href: "/dashboard", icon: BookOpen },
    { name: t("nav.sessions"), href: "/sessions", icon: Calendar },
    { name: t("nav.search"), href: "/search", icon: Search },
  ]

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Monitor className="h-4 w-4" />
    }
  }

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"]
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md px-2 py-1 transition-colors hover:text-primary"
          >
            <BookOpen className="h-6 w-6" aria-hidden="true" />
            <span>TutorHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          id="main-navigation"
          className="hidden md:flex items-center gap-6"
          role="navigation"
          aria-label="Main navigation"
        >
          {user &&
            navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md px-3 py-2 transition-colors"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <AccessibleButton
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label={`Switch theme (current: ${theme})`}
            className="transition-colors hover:bg-accent"
          >
            {getThemeIcon()}
          </AccessibleButton>

          {user ? (
            <>
              {/* Notifications */}
              <AccessibleButton
                variant="ghost"
                size="icon"
                aria-label="View notifications"
                className="transition-colors hover:bg-accent"
              >
                <Bell className="h-4 w-4" />
              </AccessibleButton>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <AccessibleButton
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full transition-colors hover:bg-accent"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.full_name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </AccessibleButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("nav.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      {t("nav.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    {t("nav.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <AccessibleButton
                    variant="ghost"
                    size="icon"
                    className="md:hidden transition-colors hover:bg-accent"
                    aria-label="Open mobile menu"
                  >
                    <Menu className="h-5 w-5" />
                  </AccessibleButton>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 text-lg font-medium hover:text-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md px-3 py-2 transition-colors"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <AccessibleButton variant="ghost" asChild>
                <Link href="/auth/signin">{t("nav.signIn")}</Link>
              </AccessibleButton>
              <AccessibleButton asChild>
                <Link href="/auth/signup">{t("nav.signUp")}</Link>
              </AccessibleButton>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
