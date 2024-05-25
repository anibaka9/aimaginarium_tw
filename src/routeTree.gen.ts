/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RoomRoomIdImport } from './routes/room/$roomId'

// Create Virtual Routes

const JoinLazyImport = createFileRoute('/join')()
const CreateLazyImport = createFileRoute('/create')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const JoinLazyRoute = JoinLazyImport.update({
  path: '/join',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/join.lazy').then((d) => d.Route))

const CreateLazyRoute = CreateLazyImport.update({
  path: '/create',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/create.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const RoomRoomIdRoute = RoomRoomIdImport.update({
  path: '/room/$roomId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/create': {
      preLoaderRoute: typeof CreateLazyImport
      parentRoute: typeof rootRoute
    }
    '/join': {
      preLoaderRoute: typeof JoinLazyImport
      parentRoute: typeof rootRoute
    }
    '/room/$roomId': {
      preLoaderRoute: typeof RoomRoomIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexLazyRoute,
  CreateLazyRoute,
  JoinLazyRoute,
  RoomRoomIdRoute,
])

/* prettier-ignore-end */
