
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../api/profileService'
import { getToken } from '../api/authService'

function Profile() {
  const navigate = useNavigate()
  const token = getToken()

  // Profile information
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  })

  // Change password states
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Delete account states
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Loading and feedback states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const data = await getProfile(token)

        setProfile({
          name: data.name || '',
          email: data.email || '',
        })
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load profile'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token, navigate])

   // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await updateProfile(profile, token)

      // Backend returns updated user inside response.user
      const updatedUser = response.user

      setProfile({
        name: updatedUser.name || profile.name,
        email: updatedUser.email || profile.email,
      })

      // Update user data saved in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')

      localStorage.setItem(
        'user',
        JSON.stringify({
          ...storedUser,
          name: updatedUser.name,
          email: updatedUser.email,
        })
      )

      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile'
      )
    } finally {
      setSaving(false)
    }
  }


  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match')
      return
    }

    try {
      setPasswordSaving(true)

      await changePassword(
        {
          oldPassword,
          newPassword,
        },
        token
      )

      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')

      setSuccess('Password changed successfully!')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to change password'
      )
    } finally {
      setPasswordSaving(false)
    }
  }

  // Delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault()

    try {
      setDeleting(true)
      setError('')
      setSuccess('')

      await deleteAccount(deletePassword, token)

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      navigate('/login')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to delete account'
      )
    } finally {
      setDeleting(false)
    }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>
        <p>Manage your personal account information</p>

        {/* Error and success messages */}
        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        {/* Personal Information */}
        <div className="profile-card">
          <div className="profile-header">
            <h2>Personal Information</h2>
            <p>Update your name and email address</p>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="profile-form-group">
              <label htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className="profile-save-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="profile-card password-card">
          <div className="profile-header">
            <h2>Change Password</h2>
            <p>Keep your account secure with a strong password</p>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="profile-form-group">
              <label htmlFor="old-password">Current Password</label>
              <input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="profile-save-btn"
              disabled={passwordSaving}
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="profile-card delete-account-card">
          <div className="profile-header">
            <h2>Delete Account</h2>
            <p>
              Permanently delete your NexaCart account.
              This action cannot be undone.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              type="button"
              className="delete-account-btn"
              onClick={() => {
                setError('')
                setSuccess('')
                setShowDeleteConfirm(true)
              }}
            >
              Delete My Account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount}>
              <div className="profile-form-group">
                <label htmlFor="delete-password">
                  Confirm Your Password
                </label>

                <input
                  id="delete-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div className="delete-actions">
                <button
                  type="submit"
                  className="delete-account-btn"
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>

                <button
                  type="button"
                  className="cancel-delete-btn"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeletePassword('')
                    setError('')
                  }}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
