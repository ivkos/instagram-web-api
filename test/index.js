import path from 'path'
import test from 'ava'
import FileCookieStore from 'tough-cookie-filestore'
import Instagram from '../lib'
import { media, users, locations, tags } from './helpers'

const cookieStore = new FileCookieStore(path.join(__dirname, './cookies.json'))

const client = new Instagram({ cookieStore })
let commentId

test('getActivity', async t => {
  const user = await client.getActivity()

  t.true('activity_feed' in user)
  t.true('edge_follow_requests' in user)
})

test('getProfile', async t => {
  const profile = await client.getProfile()

  t.is(typeof profile, 'object')
})

test('getMediaFeedByLocation', async t => {
  const { id, name } = await client.getMediaFeedByLocation({
    locationId: locations.Santiago.id
  })

  t.is(id, locations.Santiago.id)
  t.is(name, locations.Santiago.name)
})

test('getMediaFeedByHashtag', async t => {
  const { name } = await client.getMediaFeedByHashtag({
    hashtag: tags.dog.name
  })
  t.is(name, tags.dog.name)
})

test('locationSearch', async t => {
  const venues = await client.locationSearch({
    query: locations.Santiago.name,
    latitude: locations.Santiago.lat,
    longitude: locations.Santiago.lng
  })

  t.true(Array.isArray(venues))
})

test('getMediaByShortcode', async t => {
  const shortcodeMedia = await client.getMediaByShortcode({
    shortcode: media.GraphImage.shortcode
  })

  t.is(shortcodeMedia.__typename, 'GraphImage')
  t.is(shortcodeMedia.id, media.GraphImage.id)
})

test('getUserByUsername', async t => {
  const user = await client.getUserByUsername({
    username: users.Instagram.username
  })
  t.is(user.id, users.Instagram.id)
  t.is(user.username, users.Instagram.username)
})

test('getFollowers', async t => {
  const followers = await client.getFollowers({
    userId: users.Instagram.id
  })

  t.true('count' in followers)
  t.true(Array.isArray(followers.data))
})

test('getFollowings', async t => {
  const followings = await client.getFollowings({
    userId: users.Instagram.id
  })

  t.true('count' in followings)
  t.true(Array.isArray(followings.data))
})

test('addComment', async t => {
  const { status, id, text } = await client.addComment({
    mediaId: media.GraphImage.id,
    text: 'test'
  })
  commentId = id

  t.is(text, 'test')
  t.is(status, 'ok')
})

test.after('deleteComment', async t => {
  const { status } = await client.deleteComment({
    mediaId: media.GraphImage.id,
    commentId
  })
  t.is(status, 'ok')
})

test('follow', async t => {
  const { status } = await client.follow({ userId: users.Instagram.id })
  t.is(status, 'ok')
})

test.after('unfollow', async t => {
  const { status } = await client.unfollow({ userId: users.Instagram.id })
  t.is(status, 'ok')
})

test('block', async t => {
  const { status } = await client.block({ userId: users.Maluma.id })
  t.is(status, 'ok')
})

test.after('unblock', async t => {
  const { status } = await client.unblock({ userId: users.Maluma.id })
  t.is(status, 'ok')
})

test('like', async t => {
  const { status } = await client.like({ mediaId: media.GraphImage.id })
  t.is(status, 'ok')
})

test.after('unlike', async t => {
  const { status } = await client.unlike({ mediaId: media.GraphImage.id })
  t.is(status, 'ok')
})

test('save', async t => {
  const { status } = await client.save({ mediaId: media.GraphImage.id })
  t.is(status, 'ok')
})

test.after('unsave', async t => {
  const { status } = await client.unsave({ mediaId: media.GraphImage.id })
  t.is(status, 'ok')
})

test('search', async t => {
  const { status } = await client.search({ query: 'Instagram' })
  t.is(status, 'ok')
})
