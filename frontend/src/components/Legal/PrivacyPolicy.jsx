// Privacy Policy content. Text must not be edited — see LegalModal.jsx.
function PrivacyPolicy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>Last updated: 15 October 2026</p>

      <p>
        This Privacy Policy explains what information Nimeoniter collects about you, why, and how it is handled.
      </p>

      <h2>1. Data controller</h2>
      <p>
        Nimeoniter is a student project developed and maintained by JariCode (jaricode.fi). For any privacy-related
        questions, contact jaricode.fi@elisanet.fi.
      </p>

      <h2>2. Who can use Nimeoniter</h2>
      <p>
        Nimeoniter is invite-only: you can only create an account with an invitation from the developer. You must be
        at least 16 years old to use the application.
      </p>

      <h2>3. Information we collect</h2>
      <p>We collect only the information needed to run the application:</p>
      <ul>
        <li>
          Account information (via Clerk): your email address, name and profile picture, and your password in a
          securely hashed form. Accounts are managed by Clerk, our authentication provider.
        </li>
        <li>
          Google sign-in: if you sign in with Google, Clerk receives your name, email address and profile picture
          from Google. Nimeoniter does not receive any other information from your Google account, and Google does
          not receive any information about your use of Nimeoniter.
        </li>
        <li>User identifier: a unique user ID from Clerk, which links your account to your game data.</li>
        <li>
          Game data: the tasks you add and complete and their dates, your XP, level, resources, buildings and world
          progress, achievements, and your streak.
        </li>
        <li>
          Companion conversation: your messages to the in-game companion and its replies. Only the 20 most recent
          messages are kept.
        </li>
        <li>
          Technical logs: basic server logs (such as request times, addresses and error messages) kept by our
          hosting providers for security and troubleshooting.
        </li>
      </ul>
      <p>We do not use advertising, analytics or tracking, and we do not sell or rent your data to anyone.</p>

      <h2>4. The AI companion</h2>
      <p>
        The in-game companion uses OpenAI to generate its replies. When you talk to the companion, your message and a
        short summary of your game state (for example your level, resources, the day’s tasks, the time of day and an
        active holiday) are sent to OpenAI. OpenAI may retain this data for up to 30 days to monitor for abuse, and
        it is not used to train OpenAI’s models. Do not share personal or sensitive information with the companion.
      </p>

      <h2>5. Why we process your information</h2>
      <p>Your information is used to:</p>
      <ul>
        <li>sign you in and keep your account and session working</li>
        <li>store and show your game progress</li>
        <li>generate the companion’s replies</li>
        <li>keep the application secure and working</li>
      </ul>
      <p>
        Processing is based on providing the service you have signed up for. Technical logs used for security are
        processed based on our legitimate interest in keeping the application safe.
      </p>

      <h2>6. Cookies and browser storage</h2>
      <p>
        Nimeoniter uses only cookies and browser storage that are strictly necessary for the application to work, so
        no consent is needed:
      </p>
      <ul>
        <li>Clerk’s session cookies keep you signed in.</li>
        <li>Cloudflare’s cookies on Clerk’s service protect the sign-in against bots.</li>
        <li>
          Browser storage holds Clerk’s session information and one Nimeoniter setting that remembers whether the
          companion has already greeted you during this browser session.
        </li>
      </ul>
      <p>We do not use analytics, advertising or tracking cookies.</p>

      <h2>7. Service providers and data transfers</h2>
      <p>Nimeoniter relies on these service providers:</p>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Domainhotelli</td>
            <td>Hosts the application’s web pages</td>
            <td>Finland</td>
          </tr>
          <tr>
            <td>Render</td>
            <td>Hosts the backend server</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>MongoDB Atlas</td>
            <td>Stores the game data</td>
            <td>Sweden (EU)</td>
          </tr>
          <tr>
            <td>Clerk</td>
            <td>User accounts and sign-in</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>OpenAI</td>
            <td>The companion’s replies</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>Google</td>
            <td>Sign-in with Google (optional)</td>
            <td>United States</td>
          </tr>
        </tbody>
      </table>
      <p>
        Through Render, Clerk, OpenAI and Google, personal data may be processed outside the EU/EEA. These transfers
        follow the providers’ applicable data protection and transfer arrangements, such as the EU Standard
        Contractual Clauses or the EU–US Data Privacy Framework.
      </p>

      <h2>8. Data retention and deletion</h2>
      <p>
        Your account and game data are kept for as long as your account exists. You can delete your account at any
        time in Manage account. When you do, your account is removed from Clerk, and your game data and companion
        conversation are permanently deleted from our database. Data sent to OpenAI is deleted by OpenAI within 30
        days. Server logs are deleted according to the hosting providers’ own retention periods.
      </p>

      <h2>9. Your rights</h2>
      <p>Under the EU General Data Protection Regulation (GDPR), you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you</li>
        <li>have inaccurate data corrected</li>
        <li>have your account and data deleted</li>
        <li>receive your data in a commonly used format</li>
        <li>object to processing based on our legitimate interest</li>
      </ul>
      <p>
        To use these rights, contact jaricode.fi@elisanet.fi. You can also lodge a complaint with the Finnish Data
        Protection Ombudsman (tietosuoja.fi) if you believe your personal data is being processed unlawfully.
      </p>

      <h2>10. Changes to this Privacy Policy</h2>
      <p>
        We may update this Privacy Policy. The latest version is always available in the application, and the date
        at the top shows when it was last updated.
      </p>
    </>
  );
}

export default PrivacyPolicy;