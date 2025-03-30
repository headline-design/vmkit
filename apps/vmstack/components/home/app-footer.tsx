"use client";

import {
  useParams,
  usePathname,
  useSelectedLayoutSegment,
} from "next/navigation";

import Link from "next/link";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import Github from "@/icons/brand-icons/github";
import { HOME_DOMAIN } from "@/lib/constants";
import MaxWidthWrapper from "../ui/layout/max-width-wrapper";
import Twitter from "@/icons/brand-icons/twitter";
import LinkedIn from "@/icons/brand-icons/linkedin";
import ThemeSwitcher from "../theme-switcher";
import VMStackLogoType from "@/icons/brand-icons/vmstack-logo";

const navigation = {
  product: [
    { name: "Contact", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  company: [{ name: "Blog", href: "#" }],
  resources: [{ name: "Help Center", href: "#" }],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

const navigationCondensed = {
  condensed: [
    { name: "Contact", href: "#" },
    { name: "Changelog", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "Metatags API", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
};

export default function Footer({
  type = "regular",
  className,
}: {
  type?: "regular" | "slim";
  className?: any;
}) {
  const { domain = "vmkit.xyz" } = useParams() as unknown as { domain: string };
  const pathname: string = usePathname();
  const selectedLayout = useSelectedLayoutSegment();
  const isHomePathname = pathname === "/";
  const rustCenter = selectedLayout === "rust";

  const createHref = (href: string) =>
    domain === "vmkit.xyz"
      ? `${HOME_DOMAIN}${href}`
      : `https://vmkit.xyz${href}`;

  const SlimFooter = ({ domain, navigationCondensed }) => (
    <>
      <footer className="relative border-t bg-background/50 backdrop-blur-lg lg:pt-10">
        <MaxWidthWrapper className="pb-10 pt-10 lg:pt-0">
          <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3 lg:justify-between ">
            <div className="order-2 space-y-8 border-t pt-6 lg:order-1 lg:col-span-2 lg:border-0 lg:pt-0">
              <div className="flex flex-col items-center lg:flex-row lg:justify-start lg:gap-3">
                <Link
                  prefetch={false}
                  href={createHref("/")}
                >
                  <span className="sr-only">vmkit.xyz Logo</span>
                  <VMStackLogoType className="h-7 text-primary" />
                </Link>

                <p className="hidden w-full items-center text-sm leading-5 text-secondary lg:flex">
                  © Copyright {new Date().getFullYear()} HEADLINE INC. All
                  rights reserved.
                </p>
              </div>
            </div>

            <div className="order-3 flex justify-center space-y-8 lg:order-2 lg:col-span-1 lg:justify-end">
              <span className="stat-wrapper inline-flex items-center rounded-md bg-accents-1 px-2 py-1 text-xs font-medium text-secondary ring-1 ring-inset ring-gray-500/10">
                <p className="text-xsm text">Status:</p>
                <span className="stat-indicator"></span>
                <p className="text-xsm text text-blue-500">
                  All systems normal.
                </p>
              </span>
            </div>

            <div className="order-1 space-y-8 lg:order-3 lg:col-span-2">
              <ul
                role="list"
                className="space-c-4 grid grid-cols-2 justify-between align-middle md:grid-cols-3 lg:flex"
              >
                {navigationCondensed.condensed.map((item) => (
                  <li className="py-2" key={item.name}>
                    <Link
                      prefetch={false}
                      href={createHref(item.href)}
                      className="text-sm text-secondary hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-4 flex justify-center space-y-8 lg:order-4 lg:col-span-1 lg:justify-end">
              <div className="flex items-center space-x-2">
                <a
                  href="https://twitter.com/headline_crypto"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-md p-2 transition-colors hover:bg-accent "
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5 text-secondary" />
                </a>
                <div className="h-8 border border-l" />
                <a
                  href="https://github.com/headline-design"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md p-2 transition-colors hover:bg-accent "
                >
                  <span className="sr-only">Github</span>
                  <Github className="h-5 w-5 text-secondary" />
                </a>
                <div className="h-8 border border-l" />
                <a
                  href="https://www.linkedin.com/company/hdlne/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md p-2 transition-colors hover:bg-accent "
                >
                  <span className="sr-only">LinkedIn</span>
                  <LinkedIn className="h-5 w-5" fill="#52525B" />
                </a>
              </div>
            </div>
            <div className="order-5 flex space-y-8 lg:order-4 lg:col-span-1 lg:hidden lg:justify-end">
              <p className="w-full items-center text-center text-xs leading-5 text-secondary lg:hidden">
                © Copyright {new Date().getFullYear()} HEADLINE INC. All rights
                reserved.
              </p>
            </div>
          </div>
        </MaxWidthWrapper>
      </footer>
    </>
  );

  const RegularFooter = ({
    domain,
    navigation,
    className,
  }: {
    domain?: any;
    navigation?: any;
    className?: any;
  }) => (
    <>
      <footer
        className={cn(
          className,
          isHomePathname ? "!border-t-0 !bg-transparent" : null,
          "rust-footer z-10 py-8",
        )}
      >
        <MaxWidthWrapper className="!px-6 pt-10">
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            <div className="space-y-8 lg:col-span-2">
              <Link
                prefetch={false}
                href={createHref("/")}
              >
                <span className="sr-only">vmkit.xyz Logo</span>
                <VMStackLogoType className="h-7 text-primary" />
              </Link>
              <p className="max-w-xs text-sm text-secondary">
                Giving Web3 teams superpowers with tools that stand out.
              </p>
              <span className="stat-wrapper-lg inline-flex items-center rounded-md bg-accents-1 px-2 py-1 text-xs font-medium text-secondary ring-1 ring-inset ring-gray-500/10 md:bg-transparent md:px-0 md:py-0 md:ring-0 md:ring-transparent">
                <p className="text-xsm text">Status:</p>
                <span className="stat-indicator"></span>
                <p className="text-xsm text text-blue-500">
                  All systems normal.
                </p>
              </span>
              <div className="flex items-center space-x-2">
                <a
                  href="https://twitter.com/headline_crypto"
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-md p-2 transition-colors hover:bg-accent "
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5 text-secondary" />
                </a>
                <div className="h-8 border border-l" />
                <a
                  href="https://github.com/headline-design"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md p-2 transition-colors hover:bg-accent "
                >
                  <span className="sr-only">Github</span>
                  <Github className="h-5 w-5 text-secondary" />
                </a>
                <div className="h-8 border border-l" />
                <a
                  href="https://www.linkedin.com/company/hdlne/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md p-2 transition-colors hover:bg-accent "
                >
                  <span className="sr-only">LinkedIn</span>
                  <LinkedIn className="h-5 w-5" fill="#52525B" />
                </a>
              </div>
              <Suspense fallback={null}>
                <ThemeSwitcher />
              </Suspense>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 lg:col-span-3 lg:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-primary">
                    Product
                  </h3>
                  <ul role="list" className="mt-4 space-y-4">
                    {navigation.product.map((item) => (
                      <li key={item.name}>
                        <Link
                          prefetch={false}
                          href={createHref(item.href)}
                          className="text-sm text-secondary hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold text-secondary">
                    Company
                  </h3>
                  <ul role="list" className="mt-4 space-y-4">
                    {navigation.company.map((item) => (
                      <li key={item.name}>
                        <Link
                          prefetch={false}
                          href={createHref(item.href)}
                          className="text-sm text-secondary hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-secondary">
                    Resources
                  </h3>
                  <ul role="list" className="mt-4 space-y-4">
                    {navigation.resources.map((item) => (
                      <li key={item.name}>
                        <Link
                          prefetch={false}
                          href={createHref(item.href)}
                          className="text-sm text-secondary hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold text-secondary">
                    Legal
                  </h3>
                  <ul role="list" className="mt-4 space-y-4">
                    {navigation.legal.map((item) => (
                      <li key={item.name}>
                        <Link
                          prefetch={false}
                          href={createHref(item.href)}
                          className="text-sm text-secondary hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-sm leading-5 text-secondary">
              © {new Date().getFullYear()} vmkit.xyz
            </p>
          </div>
        </MaxWidthWrapper>
      </footer>
    </>
  );

  // If we're on rust design layout, we don't want to show the main nav
  if (rustCenter) {
    return null;
  }

  return (
    <>
      {type === "slim" ? (
        <SlimFooter domain={domain} navigationCondensed={navigationCondensed} />
      ) : (
        <RegularFooter
          domain={domain}
          navigation={navigation}
          className={className}
        />
      )}
    </>
  );
}
