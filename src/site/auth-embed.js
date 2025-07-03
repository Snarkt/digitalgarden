document.addEventListener("DOMContentLoaded", () => {
  const identity = window.netlifyIdentity;
  if (!identity) {
    console.error("Netlify Identity 尚未載入");
    return;
  }

  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const inviteToken = hashParams.get("invite_token");
  const recoveryToken = hashParams.get("recovery_token") || hashParams.get("token");

  if (inviteToken) {
    identity.completeSignup(inviteToken)
      .then(user => {
        console.log("邀請註冊完成:", user);
        identity.open("login");
      })
      .catch(err => {
        console.error("邀請錯誤:", err);
        alert("邀請連結無效或已過期，請聯絡管理員。");
      });
  } else if (recoveryToken) {
    identity.open("recover");
    identity.recover(recoveryToken)
      .then(() => {
        console.log("請完成密碼重設");
      })
      .catch(err => {
        console.error("密碼重設錯誤:", err);
        alert("密碼重設連結無效或已過期。");
      });
  } else {
    identity.open("login");
  }

  identity.on("login", () => {
    identity.close();
  });

  identity.init();
});
