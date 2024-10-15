"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD", "VND"]

export default function CurrencyPage() {
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("VND")
  const [result, setResult] = useState<number | null>(null)

  const handleConvert = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // In a real app, you would fetch the exchange rate and calculate the result
    // This is a mock conversion rate for USD to VND
    const mockRate = 23000
    setResult(parseFloat(amount) * mockRate)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Currency Converter</h1>
      <Card>
        <CardHeader>
          <CardTitle>Convert Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConvert} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromCurrency">From</Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger id="fromCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toCurrency">To</Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger id="toCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Convert</Button>
          </form>
          {result !== null && (
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold">{result.toLocaleString()} {toCurrency}</p>
              <p className="text-sm text-muted-foreground">
                {parseFloat(amount).toLocaleString()} {fromCurrency} =
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
