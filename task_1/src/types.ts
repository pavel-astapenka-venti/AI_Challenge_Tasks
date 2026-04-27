import type { Component } from 'vue'

export interface Activity {
  title: string
  category: string
  date: string
  points: number
}

export interface User {
  id: number
  name: string
  title: string
  unit: string
  avatarUrl: string
  activities: Activity[]
}

export interface PodiumUser extends User {
  rank: number
}

export interface RankedUser extends User {
  rank: number
}

export interface Category {
  name: string
  icon: Component
}
