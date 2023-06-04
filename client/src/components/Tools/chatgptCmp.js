import { useState, useEffect } from "react";
import "./chatgptCmp.css";

export default function ChatgptCmp({ onCancel, gridData }) {
	const [value, setValue] = useState("");
	const [docId, setDocId] = useState(null);
	const [calledSummary, setCalledSummary] = useState(false);
	const [previousChats, setPreviousChats] = useState([
		{
			role: "system",
			content: JSON.stringify(gridData),
		},
		{
			role: "system",
			content:
				"You are helpful assistant bot who takes this data to answer questions and provides human readable sentences as answers.  Provide answers only as they pertain to the business with Twilio.",
		},
	]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const listBottom = document.querySelector("#list-bottom");
	// const DOMAIN = "http://localhost:3000";
	const DOMAIN = "https://open-grid-sf.herokuapp.com";

	useEffect(() => {
		// getReadableData(gridData);
		console.log(gridData);
	}, []);

	useEffect(() => {
		if (value !== "") {
			setValue("");
			getMessages();
		}
	}, [previousChats]);

	const addQuestion = (e) => {
		e.preventDefault();
		setLoading(true);
		const newMessage = { role: "user", content: value };
		setPreviousChats([...previousChats, newMessage]);
		scrollToBottom();
	};

	const getReadableData = async (gridData) => {
		setLoading(true);
		const options = {
			method: "POST",
			body: JSON.stringify({
				input: gridData,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			const response = await fetch(`${DOMAIN}/readabledata`, options);
			const data = await response.json();
			if (data.error) {
				console.log(data.error.code);
				setError(data.error.code);
			} else {
				console.log(data);
				setDocId(data.docId);
				// const newMessage = { role: "assistant", content: data };
				// setPreviousChats([...previousChats, newMessage]);
				// setCalledSummary(true);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
			scrollToBottom();
		}
	};

	const getMessages = async () => {
		const options = {
			method: "POST",
			body: JSON.stringify({
				messages: previousChats,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			const response = await fetch(`${DOMAIN}/completions`, options);
			const data = await response.json();
			if (data.error) {
				console.log(data.error.code);
				setError(data.error.code);
			} else {
				console.log(data);
				const newMessage = { role: "assistant", content: data.data.content };
				setPreviousChats([...previousChats, newMessage]);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
			scrollToBottom();
		}
	};

	const inboundOrOutboundStyle1 = (role) => {
		return role === "user" ? "slds-chat-listitem_outbound" : "slds-chat-listitem_inbound";
	};

	const inboundOrOutboundStyle2 = (role) => {
		return role === "user"
			? "slds-chat-message__text_outbound"
			: "slds-chat-message__text_inbound";
	};

	const scrollToBottom = () => {
		setTimeout(() => {
			listBottom.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
		}, 0);
	};

	const nonSystemMessages = previousChats.filter((message) => message.role !== "system");

	return (
		<>
			<section
				role="dialog"
				tabindex="-1"
				aria-modal="true"
				aria-labelledby="chatGPT Insights"
				className="slds-modal slds-fade-in-open slds-modal_medium">
				<div className="slds-modal__container">
					<button
						onClick={onCancel}
						className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
						<svg
							className="slds-button__icon slds-button__icon_large"
							aria-hidden="true">
							<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
						</svg>
						<span className="slds-assistive-text">Cancel and close</span>
					</button>
					<div className="slds-modal__header">
						<h1 id="modal-heading-01" className="slds-modal__title slds-hyphenate">
							ChatGPT Insights
						</h1>
					</div>
					<div className="slds-modal__content slds-p-around_medium">
						<div className="content-container">
							{error && (
								<div className="slds-notify_container slds-is-relative">
									<div
										className="slds-notify slds-notify_toast slds-theme_error"
										role="status">
										<span className="slds-assistive-text">error</span>
										<span
											className="slds-icon_container slds-icon-utility-error slds-m-right_small slds-no-flex slds-align-top"
											title="Description of icon when needed">
											<svg
												className="slds-icon slds-icon_small"
												aria-hidden="true">
												<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#error"></use>
											</svg>
										</span>
										<div className="slds-notify__content">
											<h2 className="slds-text-heading_small ">{error}</h2>
										</div>
										<div className="slds-notify__close">
											<button
												onClick={() => setError(null)}
												className="slds-button slds-button_icon slds-button_icon-inverse"
												title="Close">
												<svg
													className="slds-button__icon slds-button__icon_large"
													aria-hidden="true">
													<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
												</svg>
												<span className="slds-assistive-text">Close</span>
											</button>
										</div>
									</div>
								</div>
							)}
							<section className="main">
								<section role="log" className="slds-chat">
									<ul className="slds-chat-list">
										{nonSystemMessages?.map((chatMessage, index) => (
											<li
												className={`slds-chat-listitem ${inboundOrOutboundStyle1(
													chatMessage.role
												)}`}
												key={index}>
												<div
													id={`msg_${index}`}
													className="slds-chat-message__body">
													<div
														className={`slds-chat-message__text ${inboundOrOutboundStyle2(
															chatMessage.role
														)}`}>
														{chatMessage.content}
													</div>
												</div>
											</li>
										))}
									</ul>
									<div id="list-bottom"></div>
								</section>
							</section>
						</div>
					</div>
					<div className="slds-modal__footer">
						<form onSubmit={addQuestion} className="slds-form form-container">
							<div className="slds-form-element expand-fill">
								<div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_left slds-input-has-icon_group-right">
									<textarea
										value={value}
										rows="2"
										onChange={(e) => setValue(e.target.value)}
										class="slds-textarea"></textarea>
									{loading && (
										<div className="loading-centered">
											<div
												role="status"
												className="slds-spinner slds-spinner_brand slds-spinner_x-small slds-input__spinner">
												<span className="slds-assistive-text">Loading</span>
												<div className="slds-spinner__dot-a"></div>
												<div className="slds-spinner__dot-b"></div>
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="button-container">
								<button
									className="slds-button slds-button_icon-brand slds-button_icon"
									type="submit"
									title="Submit">
									<svg className="slds-button__icon" aria-hidden="true">
										<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#new"></use>
									</svg>
									<span className="slds-assistive-text">submit</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
			<div className="slds-backdrop slds-backdrop_open" role="presentation"></div>
		</>
	);
}
