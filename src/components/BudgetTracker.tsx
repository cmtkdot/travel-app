"use client"

import React, { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useToast, Toast } from "../components/ui/use-toast"
import { Spinner } from "../components/ui/spinner"
import { supabase } from "../lib/supabase"

type Expense = {
  id: number
  description: string
  amount: number
  category: string
}

export function BudgetTracker({ tripId }: { tripId: number }): React.ReactElement {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '' })
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { toast, showToast } = useToast()

  useEffect(() => {
    fetchExpenses()
  }, [tripId])

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    setTotalExpenses(total)
  }, [expenses])

  async function fetchExpenses() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', tripId)

      if (error) throw error

      setExpenses(data || [])
    } catch (error) {
      console.error('Error fetching expenses:', error)
      showToast({
        message: "Failed to fetch expenses",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function addExpense(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(newExpense.amount)
    if (isNaN(amount)) {
      showToast({
        message: "Please enter a valid amount",
        type: "error",
      })
      return
    }
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            trip_id: tripId,
            description: newExpense.description,
            amount: amount,
            category: newExpense.category
          }
        ])
        .select()

      if (error) throw error

      setExpenses([...expenses, data[0]])
      setNewExpense({ description: '', amount: '', category: '' })
      showToast({
        message: "Expense added successfully",
        type: "success",
      })
    } catch (error) {
      console.error('Error adding expense:', error)
      showToast({
        message: "Failed to add expense",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function removeExpense(id: number) {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error

      setExpenses(expenses.filter(expense => expense.id !== id))
      showToast({
        message: "Expense removed successfully",
        type: "success",
      })
    } catch (error) {
      console.error('Error removing expense:', error)
      showToast({
        message: "Failed to remove expense",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && expenses.length === 0) {
    return <Spinner />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addExpense} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              required
              aria-required="true"
            />
          </div>
          <Button type="submit" disabled={isLoading}>Add Expense</Button>
        </form>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Expenses:</h3>
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex justify-between items-center">
                <span>{expense.description} - ${expense.amount.toFixed(2)} ({expense.category})</span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeExpense(expense.id)}
                  disabled={isLoading}
                  aria-label={`Remove expense: ${expense.description}`}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold text-lg">Total Expenses: ${totalExpenses.toFixed(2)}</p>
        </div>
      </CardContent>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </Card>
  )
}
