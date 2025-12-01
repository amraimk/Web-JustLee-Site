
import React from "react";

export default function Help() {
  return (
    <div className="help-page">
      <h1>Help & Support</h1>
      <p>
        Here you can find instructions and assistance for using the JL Book Sales frontend app.
        Browse the sections below to learn how to navigate and use each part of the system.
      </p>

      <section>
        <h2>📚 Dashboard Overview</h2>
        <p>
          The <strong>Dashboard</strong> gives you a quick summary of your books, authors, and customers.
          Use it as your main control center to view system activity and shortcuts to each module.
        </p>
      </section>

      <section>
        <h2>📖 Managing Books</h2>
        <ul>
          <li><strong>Register Book</strong> – Add new book details to the system.</li>
          <li><strong>List / Update Books</strong> – View, edit, or update existing books.</li>
          <li><strong>Remove Book</strong> – Delete a book that’s no longer available.</li>
        </ul>
      </section>

      <section>
        <h2>✍️ Managing Authors</h2>
        <ul>
          <li><strong>Register Author</strong> – Add new authors to the system.</li>
          <li><strong>Assign Author to Book</strong> – Link an author to a book record.</li>
          <li><strong>List Authors</strong> – View all registered authors.</li>
        </ul>
      </section>

      <section>
        <h2>👥 Managing Customers</h2>
        <ul>
          <li><strong>List Customers</strong> – View all customers in the system.</li>
        </ul>
      </section>

      <section>
        <h2>❓Need More Help?</h2>
        <p>
          If you encounter any issues or have questions not covered here,
          please contact your system administrator or email us at{" "}
          <a href="mailto:support@jlsales.com">support@jlsales.com</a>.
        </p>
      </section>
    </div>
  );
}
