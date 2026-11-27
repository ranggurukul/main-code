// Automated verification suite for Rang Gurukul Admin Authentication, Owner Access & Password Security

import { dbService, PRIMARY_OWNER_EMAIL } from './db';

async function runVerificationSuite() {
  console.log('====================================================');
  console.log(' RANG GURUKUL ADMIN AUTHENTICATION VERIFICATION SUITE ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 16;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      if (details) console.log(`       Details: ${details}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (details) console.error(`       Details: ${details}`);
    }
  }

  // Ensure clean database state
  dbService.resetToDefaults();

  // TEST 1: Authorized Primary Owner (ranggurukul@gmail.com) logs in using Google
  const test1 = await dbService.verifyAdminAccess(PRIMARY_OWNER_EMAIL, 'google');
  assert(
    test1.authorized === true && test1.isOwner === true && test1.admin?.role === 'OWNER',
    'TEST 1: Primary Owner (ranggurukul@gmail.com) logs in using Google',
    `Authorized: ${test1.authorized}, Role: ${test1.admin?.role}, Email: ${test1.admin?.email}`
  );

  // TEST 2: Legacy owner emails are no longer authorized
  const test2a = await dbService.verifyAdminAccess('thematrix2741@gmail.com', 'google');
  const test2b = await dbService.verifyAdminAccess('owner@ranggurukul.org', 'google');
  assert(
    test2a.authorized === false && test2b.authorized === false,
    'TEST 2: Legacy owner emails are rejected (only ranggurukul@gmail.com is Owner)',
    `thematrix2741 rejected: ${!test2a.authorized}, owner@ranggurukul.org rejected: ${!test2b.authorized}`
  );

  // TEST 3: Authorized staff administrator logs in using Google
  const test3 = await dbService.verifyAdminAccess('superadmin@ranggurukul.org', 'google');
  assert(
    test3.authorized === true && test3.admin?.role === 'SUPER_ADMIN' && test3.isOwner === false,
    'TEST 3: Authorized staff administrator logs in using Google',
    `Authorized: ${test3.authorized}, Role: ${test3.admin?.role}`
  );

  // TEST 4: Unauthorized person attempts Google login
  const test4 = await dbService.verifyAdminAccess('stranger.unauthorized@gmail.com', 'google');
  assert(
    test4.authorized === false &&
      test4.message ===
        'This Google account is not authorized to access the Rang Gurukul Admin Panel. Please contact the website owner for access.',
    'TEST 4: Unauthorized person attempts Google login',
    `Rejected: ${!test4.authorized}, Message: "${test4.message}"`
  );

  // TEST 5: Unauthorized person attempts to register
  const test5 = dbService.attemptAdminRegistration('stranger.unauthorized@gmail.com', 'Stranger');
  assert(
    test5.success === false &&
      test5.error === 'Access Restricted' &&
      test5.message ===
        'Administrator registration is invitation-only. Your email address has not been authorized by the Rang Gurukul owner.',
    'TEST 5: Unauthorized person attempts to register',
    `Blocked: ${!test5.success}, Error: "${test5.error}"`
  );

  // TEST 6: Owner sets initial password from Settings, then logs in with email & password
  const setPwdRes = await dbService.setAdminPassword(
    { targetEmail: PRIMARY_OWNER_EMAIL, newPassword: 'OwnerSecure#Password2026' },
    PRIMARY_OWNER_EMAIL
  );
  const test6LoginOk = await dbService.verifyAdminAccess(
    PRIMARY_OWNER_EMAIL,
    'password',
    'OwnerSecure#Password2026'
  );
  const test6LoginBad = await dbService.verifyAdminAccess(
    PRIMARY_OWNER_EMAIL,
    'password',
    'WrongPassword123'
  );
  assert(
    setPwdRes.success === true && test6LoginOk.authorized === true && test6LoginBad.authorized === false,
    'TEST 6: Owner sets password and authenticates with correct password (rejects wrong password)',
    `Set: ${setPwdRes.success}, CorrectLogin: ${test6LoginOk.authorized}, WrongLoginRejected: ${!test6LoginBad.authorized}`
  );

  // TEST 7: Owner changes password from Settings (requires current password)
  const changeWrongCurrent = await dbService.setAdminPassword(
    {
      targetEmail: PRIMARY_OWNER_EMAIL,
      currentPassword: 'WrongCurrentPassword',
      newPassword: 'OwnerNew#Password2027',
    },
    PRIMARY_OWNER_EMAIL
  );
  const changeCorrectCurrent = await dbService.setAdminPassword(
    {
      targetEmail: PRIMARY_OWNER_EMAIL,
      currentPassword: 'OwnerSecure#Password2026',
      newPassword: 'OwnerNew#Password2027',
    },
    PRIMARY_OWNER_EMAIL
  );
  const loginWithNewPwd = await dbService.verifyAdminAccess(
    PRIMARY_OWNER_EMAIL,
    'password',
    'OwnerNew#Password2027'
  );
  const loginWithOldPwd = await dbService.verifyAdminAccess(
    PRIMARY_OWNER_EMAIL,
    'password',
    'OwnerSecure#Password2026'
  );
  assert(
    changeWrongCurrent.success === false &&
      changeCorrectCurrent.success === true &&
      loginWithNewPwd.authorized === true &&
      loginWithOldPwd.authorized === false,
    'TEST 7: Owner changes password from Settings (verifies current password & invalidates old password)',
    `WrongCurrentBlocked: ${!changeWrongCurrent.success}, Changed: ${changeCorrectCurrent.success}, NewWorks: ${loginWithNewPwd.authorized}, OldRejected: ${!loginWithOldPwd.authorized}`
  );

  // TEST 8: Owner adds a new administrator with email and password
  const testEmail = 'newcurator.' + Date.now() + '@ranggurukul.org';
  const adminSecret = 'Curator#Pass9988';
  const test8Add = await dbService.addAuthorizedEmail(
    {
      name: 'Test Curator',
      email: testEmail,
      role: 'CONTENT_ADMIN',
      notes: 'Temporary Verification Admin',
      password: adminSecret,
    },
    PRIMARY_OWNER_EMAIL
  );
  const test8LoginOk = await dbService.verifyAdminAccess(testEmail, 'password', adminSecret);
  const test8LoginWrong = await dbService.verifyAdminAccess(testEmail, 'password', 'WrongCuratorPass');
  assert(
    test8Add.success === true && test8LoginOk.authorized === true && test8LoginWrong.authorized === false,
    'TEST 8: Owner adds new admin with email & password (verified cryptographically)',
    `Add: ${test8Add.success}, CorrectPwd: ${test8LoginOk.authorized}, WrongPwdRejected: ${!test8LoginWrong.authorized}`
  );

  // TEST 9: Zero-plaintext password leak check in database snapshot
  const snapshotJson = JSON.stringify(dbService.getSnapshot());
  const leaksOwnerPwd = snapshotJson.includes('OwnerNew#Password2027') || snapshotJson.includes('OwnerSecure#Password2026');
  const leaksAdminPwd = snapshotJson.includes(adminSecret);
  const hasSaltedHash = snapshotJson.includes('pbkdf2_sha256$100000$');
  assert(
    !leaksOwnerPwd && !leaksAdminPwd && hasSaltedHash,
    'TEST 9: Passwords are never stored or leaked in plaintext (salted PBKDF2-SHA256 only)',
    `NoPlaintextLeak: ${!leaksOwnerPwd && !leaksAdminPwd}, SaltedPBKDF2Present: ${hasSaltedHash}`
  );

  // TEST 10: Owner removes an administrator email (also deletes credentials)
  const test10Remove = dbService.removeAuthorizedEmail(testEmail, PRIMARY_OWNER_EMAIL);
  const test10LoginAfterRemove = await dbService.verifyAdminAccess(testEmail, 'google');
  assert(
    test10Remove.success === true && test10LoginAfterRemove.authorized === false,
    'TEST 10: Owner removes an administrator email and revokes access',
    `Remove Success: ${test10Remove.success}, Subsequent Access Denied: ${!test10LoginAfterRemove.authorized}`
  );

  // TEST 11: Non-owner admin attempts to add another admin or change passwords
  const test11Add = await dbService.addAuthorizedEmail(
    {
      name: 'Intruder Added',
      email: 'intruder@domain.com',
      role: 'CONTENT_ADMIN',
    },
    'workshops@ranggurukul.org'
  );
  const test11Pwd = await dbService.setAdminPassword(
    { targetEmail: PRIMARY_OWNER_EMAIL, newPassword: 'HackedPassword123' },
    'workshops@ranggurukul.org'
  );
  assert(
    test11Add.success === false && test11Pwd.success === false,
    'TEST 11: Non-owner admin blocked from adding admins or changing passwords',
    `AddBlocked: ${!test11Add.success}, PwdBlocked: ${!test11Pwd.success}`
  );

  // TEST 12: Attempt to assign OWNER role to a non-ranggurukul@gmail.com email is blocked
  const test12OwnerRole = await dbService.addAuthorizedEmail(
    {
      name: 'Fake Owner',
      email: 'fakeowner@gmail.com',
      role: 'OWNER',
    },
    PRIMARY_OWNER_EMAIL
  );
  assert(
    test12OwnerRole.success === false,
    'TEST 12: OWNER role strictly restricted to ranggurukul@gmail.com',
    `Blocked: ${!test12OwnerRole.success}, Message: "${test12OwnerRole.message}"`
  );

  // TEST 13: Attempt to remove the last primary owner is blocked
  const test13RemoveOwner = dbService.removeAuthorizedEmail(PRIMARY_OWNER_EMAIL, PRIMARY_OWNER_EMAIL);
  assert(
    test13RemoveOwner.success === false,
    'TEST 13: Attempt to remove the last primary owner is blocked',
    `Blocked: ${!test13RemoveOwner.success}, Message: "${test13RemoveOwner.message}"`
  );

  // TEST 14: Invalid session token rejected
  const test14Session = dbService.validateAdminSession('invalid_or_expired_token_123');
  assert(
    test14Session.valid === false,
    'TEST 14: Direct URL access without valid session rejected',
    `Valid Session: ${test14Session.valid}`
  );

  // TEST 15: Logout and session revocation
  const test15Session = dbService.createAdminSession({
    id: 'adm-owner-ranggurukul',
    email: PRIMARY_OWNER_EMAIL,
    name: 'Rang Gurukul (Primary Owner)',
    role: 'OWNER',
    status: 'active',
    permissions: {} as any,
    createdAt: new Date().toISOString(),
  });
  const test15ValidBefore = dbService.validateAdminSession(test15Session.token);
  dbService.revokeAdminSession(test15Session.token);
  const test15ValidAfter = dbService.validateAdminSession(test15Session.token);
  assert(
    test15ValidBefore.valid === true && test15ValidAfter.valid === false,
    'TEST 15: Logout and session termination',
    `Session Valid Before: ${test15ValidBefore.valid}, Session Valid After: ${test15ValidAfter.valid}`
  );

  // TEST 16: Refresh session continuity
  const test16Session = dbService.createAdminSession({
    id: 'adm-owner-ranggurukul',
    email: PRIMARY_OWNER_EMAIL,
    name: 'Rang Gurukul (Primary Owner)',
    role: 'OWNER',
    status: 'active',
    permissions: {} as any,
    createdAt: new Date().toISOString(),
  });
  const test16Refresh1 = dbService.validateAdminSession(test16Session.token);
  const test16Refresh2 = dbService.validateAdminSession(test16Session.token);
  assert(
    test16Refresh1.valid === true && test16Refresh2.valid === true,
    'TEST 16: Refresh dashboard with valid session',
    `Session persists across page reloads: ${test16Refresh2.valid}`
  );

  console.log(`\n====================================================`);
  console.log(` RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log(`====================================================`);

  if (passedTests !== totalTests) {
    throw new Error(`Verification suite failed: ${passedTests}/${totalTests} passed.`);
  }
}

runVerificationSuite();
