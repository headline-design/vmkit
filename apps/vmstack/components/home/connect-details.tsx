"use client"

import { Card, CardHeader, CardTitle, Button, CardDescription, CardContent, CardFooter } from "@/components/ui"
import IconCheck from "@/icons/check"
import IconShield from "@/icons/shield"
import { shorten, truncateMicroString } from "@/lib/utils"
import { useState } from "react"

export default function SIWADetails({ user, strategy = "orm" }) {
  const [copied, setCopied] = useState(false)

  return (
    <>
      {user?.wallets ? (
        <div className="flex flex-col w-full justify-center">
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    VMkit - {truncateMicroString(user?.wallets[0]?.address, 3) || "N/A"}
                    <Button
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      size="icon"
                      variant="outline"
                      icon={copied ? <IconCheck className="h-3 w-3 flex-shrink-0" /> : <CopyIcon className="h-3 w-3 flex-shrink-0" />}
                      onClick={() => {
                        setCopied(true)
                        navigator.clipboard.writeText(user?.wallets[0]?.address)
                        setTimeout(() => {
                          setCopied(false)
                        }, 1000)
                      }

                      }
                    />
                  </CardTitle>
                  <CardDescription className="text-left">Date: {new Date().toLocaleDateString()}</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1 text-secondary">
                  <IconShield color="currentColor" />
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Authentication Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-secondary">Wallet Address</span>
                      <span>{shorten(user?.wallets[0]?.address)}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-secondary">Strategy</span>
                      <span className="text-ellipsis overflow-hidden capitalize">{strategy}</span>
                    </li>

                    {strategy === "orm" ? (
                      <>
                        <li className="flex items-center justify-between">
                          <span className="text-secondary">Database</span>
                          <span className="text-ellipsis overflow-hidden">Postgres</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-secondary">DB Provider</span>
                          <span className="text-ellipsis overflow-hidden">Supabase</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-secondary">ORM</span>
                          <span className="text-ellipsis overflow-hidden">Prisma</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center justify-between">
                          <span className="text-secondary">Auth Type</span>
                          <span className="text-ellipsis overflow-hidden">JWT</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-secondary">Persistence</span>
                          <span className="text-ellipsis overflow-hidden">Browser Storage</span>
                        </li>
                      </>
                    )}
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-secondary">Connection Status</span>
                      <span>{user ? "Connected" : "Disconnected"}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Session Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-secondary">
                        <CreditCardIcon className="h-4 w-4" />
                        Session ID
                      </dt>
                      <dd>{shorten(user?.id) || "N/A"}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-secondary">
                  Status: {user ? "Active" : "Inactive"}
                  <time dateTime={new Date().toISOString()}>{new Date().toLocaleTimeString()}</time>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">No Wallet Found</h1>
            <p className="text-secondary">Please connect your wallet to view details.</p>
          </div>
        </div>
      )}
    </>
  )
}

function Separator(props) {
  return <hr className="border-t border-muted-foreground" {...props} />
}

function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CreditCardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}

