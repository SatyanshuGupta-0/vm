const Placeorder = (product) => {
      const [showModal, setShowModal] = useState(false);
    return (
        <>
        {showModal && (
          <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-auto max-h-[90vh] p-6 relative  scrollbar-hide">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>

              {/* Modal Title */}
              <h3 className="text-2xl font-bold mb-6 text-center">Confirm Your Order</h3>

              {/* Product Details */}
              <section className="mb-6 space-y-2">
                <p><strong>Product:</strong> {product.name}</p>
                <p><strong>Size:</strong> {selectedSize?.size?.name || selectedSize?.name}</p>
                <p><strong>Color:</strong> {selectedColor?.name}</p>
                <p><strong>Quantity:</strong> {quantity}</p>
                <p><strong>Price per item:</strong> ₹{displayPrice.toLocaleString()}</p>
                <p className="text-lg font-semibold">
                  Total Price: ₹{(displayPrice * quantity).toLocaleString()}
                </p>
              </section>

              {/* Quantity Selector */}
              <div className="flex justify-center items-center gap-3 mb-6">
                Quantity:
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <hr className="mb-6 border-gray-300" />

              {/* Payment Method */}
              <section className="mb-6">
                <h4 className="font-semibold mb-3">Select Payment Method</h4>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === " Cash on Delivery"}
                      onChange={() => setPaymentMethod(" Cash on Delivery")}
                      className="cursor-pointer"
                    />
                    Cash on Delivery
                  </label>
                </div>
              </section>
              {/* Delivery Address */}
              <section className="mb-6">
                <h4 className="font-semibold mb-3">Delivery Address</h4>

                {userAddress ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Address Line"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {isAddressChanged() && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleAddressUpdate}
                          disabled={loading}
                          className="flex-1 bg-green-600 text-white py-3 rounded transition transform active:scale-95 hover:bg-green-700 disabled:opacity-50"
                        >
                          Save Address
                        </button>

                        <button
                          onClick={() => {
                            setForm(originalForm);
                            setEditAddressMode(false);
                          }}
                          className="flex-1 border border-gray-400 py-3 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-red-600">
                    <p>No delivery address found. Please add one in your profile.</p>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        navigate("/profile");
                      }}
                      className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                      Go to Profile
                    </button>
                  </div>
                )}
              </section>


              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="px-6 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-900 disabled:opacity-50"
                >
                  {loading ? "Placing order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}</>
    )
}