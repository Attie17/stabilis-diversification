# 🔐 Stabilis Login Credentials

**CONFIDENTIAL - For Team Members Only**

---

## Leadership Team

| Name | Role | Password |
|------|------|----------|
| Attie Nel | CEO & Project Manager | `attie2025` |
| Natasha Jacobs | Finance Manager | `natasha2025` |
| Berno Paul | Clinical Lead | `berno2025` |

---

## Project Team

| Name | Role | Password |
|------|------|----------|
| Lizette Botha | Case Manager | `lizette2025` |
| Bertha Vorster | Admin & Admissions Officer | `bertha2025` |
| Sne Khonyane | Youth Clinical Lead & Wellness Coordinator | `sne2025` |
| Ilse Booysen | After Care Coordinator | `ilse2025` |
| Suzanne Gelderblom | Senior Therapist & Wellness Champion | `suzanne2025` |

---

## Security Notes

- **Keep passwords confidential** - Do not share with others
- **Change default passwords** - Contact admin to update your password
- **Session security** - You'll stay logged in until you click "Logout"
- **Lost password?** - Contact Attie Nel or Natasha Jacobs for reset

---

## How to Change Your Password

To change the default password to something more secure:

1. Open `web/js/auth.js` in VS Code
2. Find your name in the `teamRoles` object
3. Update the `password` field with your new password
4. Save the file
5. Commit changes to Git (recommended)

**Example:**
```javascript
{ 
  name: "Your Name", 
  role: "Your Role", 
  password: "your_new_secure_password" 
}
```

---

## Admin: How to Add New Users

1. Open `web/js/auth.js`
2. Add user to either `admin` or `team` array:
   ```javascript
   { 
     name: "New Person", 
     role: "Their Role", 
     access: "all",  // for admin only
     milestones: [], // for team only
     password: "newperson2025" 
   }
   ```
3. Map their milestone ownership in `milestoneOwners` object
4. Save and test login

---

**Last Updated:** November 14, 2025
